interface StreamObject {
    id: string;
    onStreamConnect: Function;
}

export default class WebrtcClient {
    signalingServerPath: string;
    signalingWS: WebSocket;
    peerConnection: RTCPeerConnection;
    lastConfigureActionPromise: Promise<any[]>;
    streamObjects: { [id: string]: StreamObject } = {};

    constructor(signalingServerPath?: string) {
        this.signalingServerPath = signalingServerPath;
        this.lastConfigureActionPromise = Promise.resolve([]);
    }

    connect() {
        this.initSignalingWS();
        this.initPeerConnection();
    }

    initSignalingWS() {
        this.signalingWS = new WebSocket(this.signalingServerPath);

        this.signalingWS.onopen = () => {
            this.snedConfigure();
        };
        this.signalingWS.onmessage = (event) => {
            this.onSignalingWSMessage(event);
        };
        this.signalingWS.onerror = () => {
            console.error("WebRTC signaling error");
        };
        this.signalingWS.onclose = () => {
            console.warn("WebRTC signaling connection closed");
        };
    }

    initPeerConnection() {
        this.peerConnection = new RTCPeerConnection();

        this.peerConnection.onicecandidate = (event) => {
            console.warn("onicecandidate", event);
            if (event.candidate) {
                this.signalingWS.send(
                    JSON.stringify({
                        sdp_mline_index: event.candidate.sdpMLineIndex,
                        sdp_mid: event.candidate.sdpMid,
                        candidate: event.candidate.candidate,
                        type: "ice_candidate",
                    })
                );
            }
        };
        this.peerConnection.ontrack = (event) => {
            console.warn("ontrack", event, this.streamObjects);
            const streamObject = this.streamObjects[event.streams[0].id];
            console.warn("streamObject", streamObject, this.streamObjects);
            if (streamObject) {
                streamObject.onStreamConnect({
                    stream: event.streams[0],
                });
            }
        };
    }

    close() {
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        if (this.signalingWS) {
            this.signalingWS.close();
            this.signalingWS = null;
        }
    }

    onSignalingWSMessage = async (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === "offer") {
                await this.peerConnection.setRemoteDescription(
                    new RTCSessionDescription(data)
                );
                const mediaConstraints = {
                    optional: [{ OfferToReceiveVideo: true }],
                };

                const sessionDescription = await this.peerConnection.createAnswer(
                    {}
                );
                this.peerConnection.setLocalDescription(sessionDescription);
                this.signalingWS.send(JSON.stringify(sessionDescription));
            } else if (data.type === "ice_candidate") {
                this.peerConnection.addIceCandidate(
                    new RTCIceCandidate({
                        sdpMLineIndex: data.sdp_mline_index,
                        candidate: data.candidate,
                    })
                );
            } else {
                console.warn(
                    `Received unkown message type '${data.type}, via WebRTC signaling channel`
                );
            }
        } catch (error) {
            console.error("onSignalingWSMessage", error);
        }
    };

    createStreamId() {
        return (
            "webrtc-stream-" + Math.floor(Math.random() * 1000000).toString()
        );
    }

    addRemoteStream(config, onStreamConnect) {
        const streamId = this.createStreamId();
        this.lastConfigureActionPromise = this.lastConfigureActionPromise.then(
            function (actions) {
                actions.push({ type: "add_stream", id: streamId });
                if (config.video) {
                    actions.push({
                        type: "add_video_track",
                        stream_id: streamId,
                        id: streamId + "/" + config.video.id,
                        src: config.video.src,
                    });
                }
                if (config.audio) {
                    actions.push({
                        type: "add_audio_track",
                        stream_id: streamId,
                        id: streamId + "/" + config.audio.id,
                        src: config.audio.src,
                    });
                }
                return actions;
            }
        );

        this.streamObjects[streamId] = {
            id: streamId,
            onStreamConnect,
        };
    }

    async snedConfigure() {
        const actions = await this.lastConfigureActionPromise;
        const configMessage = { type: "configure", actions };
        this.signalingWS.send(JSON.stringify(configMessage));
        console.warn("Send Configure", configMessage);
    }
}

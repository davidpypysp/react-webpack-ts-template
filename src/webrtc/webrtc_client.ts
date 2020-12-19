export default class WebrtcClient {
    signalingServerPath: string;
    signalingWS: WebSocket;
    peerConnection: RTCPeerConnection;
    lastConfigureActionPromise: Promise<any[]>;
    streamConfigs: { [id: string]: xassistant.StreamConfig } = {};

    constructor(path?: string) {
        this.signalingServerPath = path;
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

        // found ice event from stun server
        this.peerConnection.onicecandidate = (event) => {
            console.warn("onicecandidate", event);
            if (event.candidate) {
                // send candidate to remote-peer via signal server
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
        // video/audio track connected
        this.peerConnection.ontrack = (event) => {
            console.warn("ontrack", event);
            const stream = event.streams[0];
            if (stream) {
                const streamConfig = this.streamConfigs[stream.id];
                console.warn("streamConfig", streamConfig);
                if (streamConfig) {
                    streamConfig.onStreamConnected(stream);
                }
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
                // received offer from signal server
                console.warn("receive offer", data);
                await this.peerConnection.setRemoteDescription(
                    new RTCSessionDescription(data)
                );
                const mediaConstraints = {
                    optional: [{ OfferToReceiveVideo: true }],
                };

                // send back answer to signal server
                const sessionDescription = await this.peerConnection.createAnswer(
                    {}
                );
                this.peerConnection.setLocalDescription(sessionDescription);
                this.signalingWS.send(JSON.stringify(sessionDescription));
            } else if (data.type === "ice_candidate") {
                // received remote-peer ice_candidate from signal server
                console.warn("receive ice_candidate", data);
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

    addRemoteStream(config: xassistant.StreamConfig) {
        const streamId = "webrtc-stream-" + config.id;
        this.lastConfigureActionPromise = this.lastConfigureActionPromise.then(
            (actions) => {
                actions.push({ type: "add_stream", id: streamId });
                if (config.videoSrc) {
                    actions.push({
                        type: "add_video_track",
                        stream_id: streamId,
                        id: streamId + "/subscribed_video",
                        src: config.videoSrc,
                    });
                }
                if (config.audioSrc) {
                    actions.push({
                        type: "add_audio_track",
                        stream_id: streamId,
                        id: streamId + "/subscrebed_audio",
                        src: config.audioSrc,
                    });
                }
                return actions;
            }
        );
        this.streamConfigs[streamId] = config;
    }

    async snedConfigure() {
        const actions = await this.lastConfigureActionPromise;
        const configMessage = { type: "configure", actions };
        this.signalingWS.send(JSON.stringify(configMessage));
        console.warn("Send Configure", configMessage);
    }
}

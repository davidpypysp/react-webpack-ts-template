import axios, { AxiosInstance } from "axios";

export default class WebrtcClient {
    peerConnection: RTCPeerConnection;
    httpClient: AxiosInstance;
    onStreamConnected: (stream: MediaStream) => any;

    constructor(path?: string) {
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        // console.info("process", process);
        this.httpClient = axios.create({
            baseURL: "http://localhost:8080",
            headers: {
                // Accept: "application/json, text/plain, */*",
                // "Content-Type": "application/json",
            },
        });
    }

    connect() {
        this.initPeerConnection();
        this.connectWebrtc();
    }

    addRemoteStream(config: xassistant.StreamConfig) {
        this.onStreamConnected = config.onStreamConnected;
    }

    initPeerConnection() {
        this.peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
                },
            ],
        });
        this.peerConnection.oniceconnectionstatechange = (e) => {
            console.log(this.peerConnection.iceConnectionState);
        };
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate === null) {
                // log(pc.localDescription.sdp)
                console.log("send local sdp to server:==============\n");
            }
        };

        this.peerConnection.addTransceiver("video", { direction: "recvonly" });
        // pc.addTransceiver('audio', {'direction': 'recvonly'})

        this.peerConnection.ontrack = (event) => {
            console.info("ontrack", event);
            const stream = event.streams[0];
            if (stream && this.onStreamConnected) {
                this.onStreamConnected(stream);
            }
            event.track.onmute = function (event) {
                // el.parentNode.removeChild(el);
            };
        };
    }

    async connectWebrtc() {
        try {
            const offer = await this.peerConnection.createOffer();
            this.peerConnection.setLocalDescription(offer);
            // const response = await this.httpClient.post("/offer", offer);
            // const answer = response.data;
            // fetch(`http://localhost:8080/offer`, {
            //     method: "post",
            //     headers: {
            //         Accept: "application/json, text/plain, */*",
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(offer),
            // }).then();

            fetch(`http://localhost:8080/offer`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    // "Access-Control-Allow-Origin": "*",
                    // "Content-Type": "application/json",
                },
                body: JSON.stringify(offer),
            })
                .then((res) => {
                    return res.json();
                })
                .then((answer) => {
                    console.info("answer is ", answer);
                    this.peerConnection.setRemoteDescription(answer);
                });

            // const response = await fetch(`http://localhost:8080/offer`, {
            //     method: "post",
            //     headers: {
            //         Accept: "application/json, text/plain, */*",
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(offer),
            // });
            // console.info("response", response);
            // const answer = await response.json();

            // console.info("get answer", answer);
            // this.peerConnection.setRemoteDescription(answer);
        } catch (err) {
            console.info("connectWebrtc", err);
        }
    }
}

export const publishVideo = () => {
    const pc = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302",
            },
        ],
    });

    pc.oniceconnectionstatechange = (e) => console.log(pc.iceConnectionState);

    pc.onicecandidate = (event) => {
        if (event.candidate === null) {
            // log(pc.localDescription.sdp)
            console.log("send local sdp to server:==============\n");
        }
    };

    pc.addTransceiver("video", { direction: "recvonly" });
    // pc.addTransceiver('audio', {'direction': 'recvonly'})

    pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        return fetch(`http://localhost:8080/offer`, {
            method: "post",
            headers: {
                Accept: "application/json, text/plain, */*",
                // "Content-Type": "application/json",
            },
            body: JSON.stringify(offer),
        })
            .then((res) => {
                return res.json();
            })
            .then((answer) => {
                console.info("get answer");
                console.log(JSON.stringify(answer));
                pc.setRemoteDescription(answer);
                pc.ontrack = function (event) {
                    const el: any = document.getElementById("video-streamer");
                    el.srcObject = event.streams[0];
                    el.autoplay = true;
                    el.controls = true;

                    event.track.onmute = function (event) {
                        // el.parentNode.removeChild(el);
                    };
                };
            })
            .catch((err) => {
                console.log("err", err);
            });
    });
};

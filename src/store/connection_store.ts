import Store from ".";
import WebrtcClient from "src/webrtc/webrtc_client";
// import WebrtcClient from "src/webrtc/webrtc_go";

export default class ConnectionStore {
    rootStore: Store;
    videoConn: WebrtcClient;
    inputConn: any;

    constructor(rootStore: Store) {
        this.rootStore = rootStore;
    }

    initVideoConn = () => {
        const wsPath = "ws://localhost:8082/webrtc";
        this.videoConn = new WebrtcClient(wsPath);
    };

    connectVideoStream = (config: xassistant.StreamConfig) => {
        this.videoConn.addRemoteStream(config);
        this.videoConn.connect();
    };

    sendInputEvent = (data) => {};
}

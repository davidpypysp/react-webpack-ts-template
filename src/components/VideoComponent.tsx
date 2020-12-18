import React, { useEffect, useRef } from "react";
import WebrtcRos from "src/webrtc/webrtc_ros";

const VideoComponent = () => {
    useEffect(() => {
        const Q = {
            subscribe_video: "ros_image:/image_raw",
        };
        // document.getElementById("topic").textContent = Q.subscribe_video;

        console.log("Establishing WebRTC connection");
        const conn = WebrtcRos.createConnection(null, null);
        conn.onConfigurationNeeded = function () {
            console.log("Requesting WebRTC video subscription");
            const config: any = {};
            config.video = { id: "subscribed_video", src: Q.subscribe_video };
            conn.addRemoteStream(config).then(function (event) {
                console.log("Connecting WebRTC stream to <video> element");
                (document.getElementById("remote-video") as any).srcObject =
                    event.stream;
                event.remove.then(function (event) {
                    console.log(
                        "Disconnecting WebRTC stream from <video> element"
                    );
                    (document.getElementById(
                        "remote-video"
                    ) as any).srcObject = null;
                });
            });
            conn.sendConfigure();
        };
        conn.connect();
    }, []);

    return (
        <div style={{ marginTop: 100, width: 640, height: 480 }}>
            <video id="remote-video" autoPlay={true} />
        </div>
    );
};

export default VideoComponent;

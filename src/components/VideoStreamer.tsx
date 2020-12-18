import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import {
    createMouseEvent,
    createMouseWheelEvent,
} from "src/utils/input_handler";
import WebrtcClient from "src/webrtc/webrtc_client";

const useStyles = createUseStyles({
    streamerDiv: {
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "black",
    },
    videoStreamer: {
        width: "100%",
    },
});

const VideoStreamer = () => {
    const classes = useStyles();
    const videoElementId = "video-streamer";
    useEffect(() => {
        const webrtcClient = new WebrtcClient("ws://localhost:8082/webrtc");
        webrtcClient.addRemoteStream(
            {
                video: {
                    id: "subscribed_video",
                    src: "ros_image:/image_raw",
                },
            },
            async (event) => {
                console.warn("addRemoteStream then", event);
                const video: any = document.getElementById(videoElementId);
                video.srcObject = event.stream;
            }
        );
        webrtcClient.connect();
    }, []);
    const [dimension, setDimension] = useState<[number, number]>([-1, -1]);

    return (
        <div className={classes.streamerDiv}>
            <video
                id={videoElementId}
                className={classes.videoStreamer}
                autoPlay={true}
                onLoadedMetadata={(event) => {
                    const target: any = event.target;
                    setDimension([target.videoWidth, target.videoHeight]);
                    console.log("width is", target.videoWidth);
                    console.log("height is", target.videoHeight);
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    createMouseEvent(e.nativeEvent, dimension);
                }}
                onMouseUp={(e) => {
                    e.preventDefault();
                    createMouseEvent(e.nativeEvent, dimension);
                }}
                onDoubleClick={(e) => {
                    console.info("double click", e);
                }}
                onWheel={(e) => {
                    createMouseWheelEvent(e.nativeEvent);
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                }}
            />
        </div>
    );
};

export default VideoStreamer;

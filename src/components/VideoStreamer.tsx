import React, { useContext, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import {
    createMouseEvent,
    createMouseWheelEvent,
} from "src/utils/input_handler";
import { StoreContext } from "./App";

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
    const { connection } = useContext(StoreContext);
    useEffect(() => {
        connection.initVideoConn();
        connection.connectVideoStream({
            id: "test-video",
            videoSrc: "ros_image:/image_raw",
            onStreamConnected: (stream) => {
                console.warn("addRemoteStream ", stream);
                const videoElement = document.getElementById(
                    videoElementId
                ) as HTMLVideoElement;
                videoElement.srcObject = stream;
            },
        });
    }, []);
    const [dimension, setDimension] = useState<[number, number]>(null);

    return (
        <div className={classes.streamerDiv}>
            <video
                id={videoElementId}
                className={classes.videoStreamer}
                autoPlay={true}
                crossOrigin={"anonymous"}
                onLoadedMetadata={(event) => {
                    const target: any = event.target;
                    setDimension([target.videoWidth, target.videoHeight]);
                    console.log("width is", target.videoWidth);
                    console.log("height is", target.videoHeight);
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    connection.sendInputEvent(
                        createMouseEvent(e.nativeEvent, dimension)
                    );
                }}
                onMouseUp={(e) => {
                    e.preventDefault();
                    connection.sendInputEvent(
                        createMouseEvent(e.nativeEvent, dimension)
                    );
                }}
                onDoubleClick={(e) => {
                    console.info("double click", e);
                }}
                onWheel={(e) => {
                    connection.sendInputEvent(
                        createMouseWheelEvent(e.nativeEvent)
                    );
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                }}
            />
        </div>
    );
};

export default VideoStreamer;

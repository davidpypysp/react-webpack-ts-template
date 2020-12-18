import React from "react";
import { createUseStyles } from "react-jss";
import VideoStreamer from "./VideoStreamer";

const useStyles = createUseStyles({
    viewer: {
        flexGrow: 1,
    },
});

const Viewer = () => {
    const classes = useStyles();
    return (
        <div className={classes.viewer}>
            <VideoStreamer />
        </div>
    );
};

export default Viewer;

import React from "react";
import { Card } from "@blueprintjs/core";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    controlPanel: {
        display: "flex",
        justifyContent: "space-between",
    },
});

const ControlPanel = (props: any) => {
    const classes = useStyles();
    return (
        <Card className={classes.controlPanel}>
            <div>Connected to client ID</div>
            <div>Event </div>
        </Card>
    );
};

export default ControlPanel;

import React, { useEffect } from "react";
import { createUseStyles } from "react-jss";
import "src/index.scss";
import Viewer from "./Viewer";
import ControlPanel from "./ControlPanel";
import classNames from "classnames";
import { createKeyboardEvent } from "src/utils/input_handler";

const useStyles = createUseStyles({
    app: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        height: "100%",
    },
});

const App = () => {
    const classes = useStyles();
    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            e.preventDefault();
            createKeyboardEvent(e);
        });
        window.addEventListener("keyup", (e) => {
            e.preventDefault();
            createKeyboardEvent(e);
        });
    });

    return (
        <div className={classNames(classes.app, "bp3-dark")}>
            <Viewer />
            <ControlPanel />
        </div>
    );
};

export default App;

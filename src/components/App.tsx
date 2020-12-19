import React, { createContext, useContext, useEffect } from "react";
import { createUseStyles } from "react-jss";
import "src/index.scss";
import Viewer from "./Viewer";
import ControlPanel from "./ControlPanel";
import classNames from "classnames";
import Store from "src/store";
import { createKeyboardEvent } from "src/utils/input_handler";

const store = new Store();
export const StoreContext = createContext<Store>(store);

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
    const { connection } = useContext(StoreContext);

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            e.preventDefault();
            connection.sendInputEvent(createKeyboardEvent(e));
        });
        window.addEventListener("keyup", (e) => {
            e.preventDefault();
            connection.sendInputEvent(createKeyboardEvent(e));
        });
    });

    return (
        <StoreContext.Provider value={store}>
            <div className={classNames(classes.app, "bp3-dark")}>
                <Viewer />
                <ControlPanel />
            </div>
        </StoreContext.Provider>
    );
};

export default App;

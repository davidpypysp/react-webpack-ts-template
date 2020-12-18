export const createMouseEvent = (event, dimension: [number, number]) => {
    const { offsetX, offsetY, button, timeStamp, type } = event;

    const messageRequest = {
        msgType: 1,
    };

    console.info(
        "mouse ",
        type,
        offsetX,
        offsetY,
        button,
        dimension,
        timeStamp
    );
};

export const createMouseWheelEvent = (event) => {
    const { deltaY } = event;
    const dir = deltaY < 0 ? "scroll up" : "scroll down";
    console.info("mouse wheel", dir);
};

export const createKeyboardEvent = (event) => {
    const { keyCode, code, timeStamp, type, ctrlKey, shiftKey } = event;
    console.info("keyevent", type, keyCode, code, event);
};

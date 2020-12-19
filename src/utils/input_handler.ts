export const createMouseEvent = (event, dimension: [number, number]) => {
    const { offsetX, offsetY, button, timeStamp, type } = event;
    console.info(
        "mouse ",
        type,
        offsetX,
        offsetY,
        button,
        dimension,
        timeStamp
    );

    const data = {
        msgType: 1,
    };
    return data;
};

export const createMouseWheelEvent = (event) => {
    const { deltaY } = event;
    const dir = deltaY < 0 ? "scroll up" : "scroll down";
    console.info("mouse wheel", dir);
    const data = {};
    return data;
};

export const createKeyboardEvent = (event) => {
    const { keyCode, code, timeStamp, type, ctrlKey, shiftKey } = event;
    console.info("keyevent", type, keyCode, code, event);
    const data = {};
    return data;
};

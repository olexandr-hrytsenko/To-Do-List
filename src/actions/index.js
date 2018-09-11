export const select = (user) => {
    return {
        type: "USER_SELECTED",
        payload: user
    }
};

export const not_select = (user) => {
    return {
        type: "USER_NOT_SELECTED",
        payload: user
    }
};
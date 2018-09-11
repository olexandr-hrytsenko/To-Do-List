export default function (state=null, action) {
    switch (action.type) {
        case "USER_SELECTED":
            return action.payload;

        case "USER_NOT_SELECTED":
            return state;

        default:
            return state;
    }
}
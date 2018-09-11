import { combineReducers } from "redux";
import UsersReducers from './user';
import ActiveUser from './user-active'

const allReducers = combineReducers ({
    users: UsersReducers,
    active: ActiveUser
});

export default allReducers
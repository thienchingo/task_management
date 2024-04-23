import { combineReducers } from "redux";

import TodoReducer from "./todoTask/reducer";

const rootReducer = combineReducers({
    TodoReducer,
});

export default rootReducer;
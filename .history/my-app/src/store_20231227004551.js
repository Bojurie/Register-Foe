import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers"; // Import your root reducer here
import thunk from "redux-thunk"; // You can use Redux Thunk middleware for async actions

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

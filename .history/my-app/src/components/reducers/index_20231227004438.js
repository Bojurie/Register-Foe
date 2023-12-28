import { combineReducers } from "redux";
import authReducer from "../authReducer/authReducer"; // Import your individual reducers here

const rootReducer = combineReducers({
  auth: authReducer, // You can have multiple reducers here
  // Add other reducers as needed
});

export default rootReducer;

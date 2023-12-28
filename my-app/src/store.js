
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./components/authReducer/authReducer"; // Import your root reducer here

const store = configureStore({
  reducer: rootReducer,
  // You can add middleware, devtools, and other configuration options here
});

export default store;

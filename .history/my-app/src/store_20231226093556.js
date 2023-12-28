// store.js

import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk"; // Use named import for redux-thunk

// ... rest of your imports ...

// Combine reducers if you have more than one
const rootReducer = combineReducers({
  // your reducers
});

// Create store with middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Apply thunk middleware
);

export default store;
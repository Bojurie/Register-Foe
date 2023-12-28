// store.js

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

// Import your reducers
// import someReducer from './reducers/someReducer';

// Combine all reducers
const rootReducer = combineReducers({
  // someReducer,
  // Add other reducers here
});

// Create the Redux store
const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Apply middleware (like thunk for async actions)
);

export default store;

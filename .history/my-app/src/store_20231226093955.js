import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk"; // Corrected import

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

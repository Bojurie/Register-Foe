// import { ActionTypes } from "../ActionTypes/ActionTypes";

// export const authReducer = (state, action) => {
//   switch (action.type) {
//     case ActionTypes.LOGIN_SUCCESS:
//     case ActionTypes.REGISTER_SUCCESS:
//       return { ...state, user: action.payload.user };
//     case ActionTypes.LOGOUT:
//       return { ...state, user: null };
//     case ActionTypes.SAVE_ELECTION_SUCCESS:
//       return { ...state, isElectionSaved: true };
//     case ActionTypes.SAVE_ELECTION_ERROR:
//       return {
//         ...state,
//         isElectionSaved: false,
//         saveElectionError: action.payload.error,
//       };
//     case ActionTypes.CREATE_ELECTION_SUCCESS:
//       return { ...state, electionCreated: true };
//     case ActionTypes.CREATE_ELECTION_ERROR:
//       return {
//         ...state,
//         electionCreated: false,
//         electionError: action.payload.error,
//       };
//     default:
//       return state;
//   }
// };


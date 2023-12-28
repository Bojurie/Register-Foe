// import { useCallback } from "react";
// import { useDispatch } from "react-redux"; 
// import { useNavigate,  } from "react-router-dom";
// import { ActionTypes } from "./ActionTypes/ActionTypes";
// import {
//   removeStoredUser,
//   removeStoredToken,
// } from "./LocalStorageManager/LocalStorageManager";

// const useHandleLogout = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = useCallback(() => {
//     // Remove stored user and token
//     removeStoredUser();
//     removeStoredToken();
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");

//     dispatch({ type: ActionTypes.LOGOUT });

//     navigate("/login");
//   }, [dispatch, navigate]);

//   return handleLogout;
// };

// export default useHandleLogout;

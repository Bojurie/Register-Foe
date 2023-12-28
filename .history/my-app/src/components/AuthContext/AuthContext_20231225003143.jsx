import React, { createContext, useReducer, useCallback, useContext, useEffect } from "react";
// import { jwtDecode as jwt_decode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";


import {
  login,
  registerUser,
  registerCompany,
  saveElection,
  createElection,
  GetTopicsByCode,
} from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeStoredToken,
  setStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

export const AuthContext = createContext();

const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
  CREATE_ELECTION_SUCCESS: "CREATE_ELECTION_SUCCESS",
  CREATE_ELECTION_ERROR: "CREATE_ELECTION_ERROR",
};

// Simplify reducer cases
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.REGISTER_SUCCESS:
      return { ...state, user: action.payload.user };
    case ActionTypes.LOGOUT:
      return { ...state, user: null };
    case ActionTypes.SAVE_ELECTION_SUCCESS:
      return { ...state, isElectionSaved: true };
    case ActionTypes.SAVE_ELECTION_ERROR:
      return {
        ...state,
        isElectionSaved: false,
        saveElectionError: action.payload.error,
      };
      case ActionTypes.CREATE_ELECTION_SUCCESS:
      return { ...state, electionCreated: true };
    case ActionTypes.CREATE_ELECTION_ERROR:
      return { ...state, electionCreated: false, electionError: action.payload.error };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: getStoredUser() });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
 
    useEffect(() => {
      const storedUser = getStoredUser();
      if (storedUser) {
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user: storedUser },
        });
      }
    }, [dispatch]);

  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };


const handleLogin = useCallback(
  async (formData) => {
    try {
      const response = await login(formData);
      console.log("Raw axios response:", response);
      const { token, isCompany } = response;

      console.log("Received token:", token);
      console.log("Received isCompany flag:", isCompany);
      if (!token) {
        console.error("Token is missing from the response", response);
        enqueueSnackbar("Incomplete login data received", { variant: "error" });
        return;
      }

      let userData;
      if (isCompany) {
        userData = { ...response.companyData, isCompany: true };
        console.log("Storing company data:", userData);
      } else {
        userData = { ...response.user, isCompany: false };
        console.log("Storing user data:", userData);
      }
      if (!userData) {
        console.error(
          "User/Company data is missing from the response",
          response
        );
        enqueueSnackbar("Incomplete login data received", { variant: "error" });
        return;
      }

      // Storing token and user data
      setStoredToken(token);
      setStoredUser(userData);
      console.log("Stored token in local storage:", token);
      console.log("Stored user data in local storage:", userData);
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: userData },
      });
      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/main");
    } catch (error) {
      console.error("Login error:", error);
    }
  },
  [navigate, enqueueSnackbar, dispatch]
);



const fetchTopicsByCompanyCode = async (companyCode) => {
  try {
    const response = await GetTopicsByCode(companyCode);
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};



const handleRegister = async (formData) => {
  try {
    const response = await registerCompany(formData);
    enqueueSnackbar(response.message || "Registration successful!", {
      variant: "success",
    });
    navigate("/login");
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Registration failed. Please try again.";
    enqueueSnackbar(errorMessage, { variant: "error" });
    dispatch({
      type: ActionTypes.REGISTER_ERROR,
      payload: { error: errorMessage },
    });
  }
};


const handleCompanyRegister = async (formData) => {
  try {
    const response = await registerCompany(formData);
    enqueueSnackbar(response.message || "Registration successful!", {
      variant: "success",
    });
    navigate("/login");
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Registration failed. Please try again.";
    enqueueSnackbar(errorMessage, { variant: "error" });
    dispatch({
      type: ActionTypes.REGISTER_ERROR,
      payload: { error: errorMessage },
    });
  }
};



const handleCreateElection = async (electionData) => {
  try {
    const user = getStoredUser();
    if (!user || !user.token) {
      throw new Error("You must be logged in to create an election.");
    }
    const response = await createElection(electionData, user.token);
    dispatch({ type: ActionTypes.CREATE_ELECTION_SUCCESS });
    enqueueSnackbar("Election created successfully!", { variant: "success" });
  } catch (error) {
    dispatch({
      type: ActionTypes.CREATE_ELECTION_ERROR,
      payload: { error: error.message },
    });
    enqueueSnackbar(error.message, { variant: "error" });
  }
};


  const handleSaveElection = async (electionData) => {
    try {
      const response = await saveElection(electionData);
      dispatch(
        response.success
          ? { type: ActionTypes.SAVE_ELECTION_SUCCESS }
          : {
              type: ActionTypes.SAVE_ELECTION_ERROR,
              payload: { error: "Failed to save election" },
            }
      );
      enqueueSnackbar(
        response.success
          ? "Election saved successfully!"
          : "Failed to save election",
        { variant: response.success ? "success" : "error" }
      );
    } catch (error) {
      dispatch({
        type: ActionTypes.SAVE_ELECTION_ERROR,
        payload: { error: error.message },
      });
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const contextValue = {
    user: state.user,
    handleLogin,
    handleLogout,
    handleRegister,
    handleSaveElection,
    handleCreateElection,
    fetchTopicsByCompanyCode,
    handleCompanyRegister,
    enqueueSnackbar,
    electionCreated: state.electionCreated,
    electionError: state.electionError,
    isElectionSaved: state.isElectionSaved,
    saveElectionError: state.saveElectionError,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
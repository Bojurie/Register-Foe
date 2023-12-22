import { createContext, useContext, useEffect, useReducer } from "react";
import { loginUser, registerUser, saveElection} from "../AuthAPI/AuthAPI";
import { useNavigate } from "react-router";
import {
  getStoredUser,
  removeStoredUser,
  getStoredToken,
  removeStoredToken,
} from "../LocalStorageManager/LocalStorageManager";
import { useAuth } from "../AuthContext/AuthContext";


export const AuthContext = createContext();

// Action types
const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.REGISTER_SUCCESS:
      return { ...state, user: action.payload.user };
    case ActionTypes.LOGOUT:
      return { ...state, user: null };
      case ActionTypes.SAVE_ELECTION_SUCCESS:
      // Handle election save success
      return { ...state, isElectionSaved: true };
    case ActionTypes.SAVE_ELECTION_ERROR:
      // Handle election save error
      return { ...state, isElectionSaved: false, saveElectionError: action.payload.error };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = { user: null };
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  // const { handleSaveElection } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      if (token) {
        const user = getStoredUser();
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
      }
    };
    initializeAuth();
  }, []);

  const register = async (formData) => {
    try {
      const response = await registerUser(formData);
      if (response.success) {
        console.log("User registered successfully");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const login = async (formData) => {
    try {
      const { user } = await loginUser(formData);
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
      navigate("/main");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Inside your React component or context

  const handleSaveElection = async (electionData) => {
    try {
      const response = await saveElection(electionData);
      if (response && response.success) {
        dispatch({ type: ActionTypes.SAVE_ELECTION_SUCCESS });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SAVE_ELECTION_ERROR,
        payload: { error: error.message },
      });
    }
  };

  const logout = async () => {
    removeStoredUser();
    removeStoredToken();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/");
  };

  const contextValue = {
    user: state.user,
    login,
    logout,
    register,
    saveElection,
    isElectionSaved: state.isElectionSaved,
    saveElectionError: state.saveElectionError,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

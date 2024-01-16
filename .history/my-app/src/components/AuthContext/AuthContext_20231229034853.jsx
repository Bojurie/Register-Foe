import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useDispatch } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";

import {
  login,
  registerUser,
  registerCompany,
  saveElection,
  createElection,
  GetTopicsByCode,
  getUsersByCompanyCode,
  createTopic,
  GetUpComingElections,
} from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeStoredToken,
  setStoredToken,
  getStoredToken,
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
      return {
        ...state,
        electionCreated: false,
        electionError: action.payload.error,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
 const [state, dispatch] = useReducer(authReducer, {
   user: getStoredUser(),
 });  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: storedUser },
      });
}})

useEffect(() => {
    const token = getStoredToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

const useHandleLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = useCallback(
    async (formData) => {
      try {
        const response = await login(formData);
        if (!response.token) {
          throw new Error("Token is missing from the login response.");
        }
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;
        setStoredToken(response.token);
        setStoredUser(response.user);

        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user: response.user },
        });
        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate("/main");
      } catch (error) {
        let errorMessage = "Login failed. Please try again.";
        if (error.response) {
          errorMessage = error.response?.data?.error || errorMessage;
        }
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    },
    [navigate, dispatch, enqueueSnackbar]
  );
  return handleLogin;
};
  const { enqueueSnackbar } = useSnackbar();




const fetchUserByCompanyCode = async (companyCode) => {
  if (!companyCode) {
    console.error("Company code is undefined or null");
    return []; // Return an empty array to handle this gracefully
  }
  try {
    const response = await getUsersByCompanyCode(companyCode);
    return response.data;
  } catch (error) {
    console.error("Error fetching users by company code:", error);
    throw error;
  }
};



  const fetchTopicsByCompanyCode = async (companyCode) => {
    try {
      const response = await GetTopicsByCode(companyCode);
      return response.data;
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
  };



const useHandleRegister = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleRegister = async (formData) => {
    try {
      const response = await registerUser(formData);
      console.log("Registration response data:", response.data);

      enqueueSnackbar("Registration successful!", { variant: "success" });

      dispatch({
        type: ActionTypes.REGISTER_SUCCESS,
        payload: { user: response.data.user },  
      });

    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Registration error:", error);
      enqueueSnackbar(errorMessage, { variant: "error" });

      dispatch({
        type: ActionTypes.REGISTER_ERROR,
        payload: { error: errorMessage },
      });
    }
  };

  return handleRegister;
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
      await createElection(electionData);
    } catch (error) {
    }
  };


  


  // const getElections = async () => {
  //    try {
  //      const response = await GetUpComingElections();
  //      return response.data;
  //    } catch (error) {
  //      console.error("Error fetching topics:", error);
  //      throw error;
  //    }
  // }

  
  const handleCreateTopic = async (topicData) => {
    try {
      const user = getStoredUser();
      if (!user || !user.token) {
        throw new Error("You must be logged in to create a topic.");
      }
 axios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      const response = await createTopic(topicData, user.token);

      dispatch({
        type: ActionTypes.CREATE_TOPIC_SUCCESS,
        payload: response.topic,
      });
      enqueueSnackbar("Topic created successfully!", { variant: "success" });
    } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;

      // Dispatch error action and show error message
      dispatch({
        type: ActionTypes.CREATE_TOPIC_ERROR,
        payload: { error: errorMessage },
      });
      enqueueSnackbar(errorMessage, { variant: "error" });
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
  isAuthenticated: !!state.user,
  handleLogout,
  handleSaveElection,
  getElections,
  handleCreateElection,
  fetchTopicsByCompanyCode,
  fetchUserByCompanyCode,
  useHandleRegister,
  handleCompanyRegister,
  enqueueSnackbar,
  handleCreateTopic,
  useHandleLogin,
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

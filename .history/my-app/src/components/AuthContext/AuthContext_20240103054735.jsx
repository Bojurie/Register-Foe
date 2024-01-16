import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
  useMemo
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
  getAdminUsers,
  updateUserRoleToAdmin,
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
  });
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

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const token = getStoredToken();
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

  const handleLogin = useCallback(
    async (formData) => {
      try {
        const response = await login(formData);
        if (!response.token) {
          throw new Error("Token is missing from the login response.");
        }
        // axios.defaults.headers.common[
        //   "Authorization"
        // ] = `Bearer ${getStoredToken}`;

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
    [navigate, enqueueSnackbar, dispatch]
  );


  const fetchAdminUsers = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.error("Company code is undefined or null");
      return [];
    }
    try {
      const response = await getAdminUsers(companyCode);
      return response.data; 
    } catch (error) {
      console.error("Error fetching users by company code:", error);
      return [];
    }
  }, []); 


  const fetchUserByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.error("Company code is undefined or null");
      return { data: [] };
    }
    try {
      const response = await getUsersByCompanyCode(companyCode);
      return response;
    } catch (error) {
      console.error("Error fetching users by company code:", error);
      return { data: [] };
    }
  }, []);

  const fetchTopicsByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.log(
        "fetchTopicsByCompanyCode received companyCode:",
        companyCode
      );
      return { data: [] };
    }
    try {
      const response = await GetTopicsByCode(companyCode);
      console.log("API Response in fetchTopicsByCompanyCode:", response);

      return response;
    } catch (error) {
      throw error;
    }
  }, []);

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
      console.log(error);
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      dispatch({
        type: ActionTypes.REGISTER_ERROR,
        payload: { error: errorMessage },
      });
    }
  };

  const updateRoleToAdmin = async (userId) => {
    try {
      const response = await updateUserRoleToAdmin(userId, "Admin");
      enqueueSnackbar(response.message || "User role updated successfully!", {
        variant: "success",
      });

      // Optionally, you might want to navigate or trigger some other action
      // navigate("/dashboard"); // Example navigation after role update
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to update user role. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      dispatch({
        type: ActionTypes.UPDATE_ROLE_ERROR,
        payload: { error: errorMessage },
      });
    }
  };

 const handleCreateElection = async (formData) => {
   try {
     const token = getStoredToken();
     if (!token) {
       throw new Error("You must be logged in to create an election.");
     }

     const config = {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     };

     const response = await createElection(formData, config);
     dispatch({
       type: ActionTypes.CREATE_ELECTION_SUCCESS,
       payload: response.data.election,
     });
     enqueueSnackbar("Election created successfully!", { variant: "success" });
   } catch (error) {
     const errorMessage =
       error.response?.data?.error || "Failed to create election";
     dispatch({
       type: ActionTypes.CREATE_ELECTION_ERROR,
       payload: { error: errorMessage },
     });
     enqueueSnackbar(errorMessage, { variant: "error" });
   }
 };

  const getElections = async () => {
    try {
      const user = getStoredUser();
      const token = getStoredToken();
      if (!user || !user.token) {
        throw new Error("You must be logged in to view elections.");
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await GetUpComingElections();
      dispatch({
        type: ActionTypes.GET_ELECTIONS_SUCCESS,
        payload: response.elections,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({
        type: ActionTypes.GET_ELECTIONS_ERROR,
        payload: { error: errorMessage },
      });
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleCreateTopic = async (topicData) => {
    try {
      const user = getStoredUser();
      const token = getStoredToken();

      if (!user || !token) {
        throw new Error("You must be logged in to create a topic.");
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await createTopic(topicData);

      dispatch({
        type: ActionTypes.CREATE_TOPIC_SUCCESS,
        payload: response.topic,
      });

      enqueueSnackbar("Topic created successfully!", { variant: "success" });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
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

  const contextValue = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: !!state.user,
      handleLogout,
      handleLogin,
      handleSaveElection,
      getElections,
      handleCreateElection,
      fetchTopicsByCompanyCode,
      fetchUserByCompanyCode,
      useHandleRegister,
      handleCompanyRegister,
      enqueueSnackbar,
      handleCreateTopic,
      updateRoleToAdmin,
      fetchAdminUsers,
      electionCreated: state.electionCreated,
      electionError: state.electionError,
      isElectionSaved: state.isElectionSaved,
      saveElectionError: state.saveElectionError,
      isAuthenticated: !!state.user,
    }),
    [state.user, handleLogout, handleLogin]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

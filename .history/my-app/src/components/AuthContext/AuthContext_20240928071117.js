import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { validateToken } from "../../AuthService/validateToken";
import {
  login,
  registerUser,
  registerCompany,
  getUsersByCompanyCode,
  getAdminUsers,
  getUserById,
  GetTopicsByCode,
  topicLike,
  dislikeTopicLike,
  saveElection,
  createElection,
  getSavedElections,
  getPastElections,
  GetUpComingElections,
  GetUpComingNews,
  getElectionsByTheirId,
  createTopic,
  createCompanyNews,
  newReminder,
  fetchReminder,
  handleDeleteReminder,
  updateUserRoleToAdmin,
  updateUserProfileLike,
} from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  getStoredToken,
  removeStoredToken,
  setStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
  CREATE_ELECTION_SUCCESS: "CREATE_ELECTION_SUCCESS",
  CREATE_ELECTION_ERROR: "CREATE_ELECTION_ERROR",
  CREATE_COMPANY_NEWS_SUCCESS: "CREATE_COMPANY_NEWS_SUCCESS",
  CREATE_COMPANY_NEWS_ERROR: "CREATE_COMPANY_NEWS_ERROR",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return { ...state, user: action.payload.user };
    case ActionTypes.LOGOUT:
      return { ...state, user: null };
    case ActionTypes.REGISTER_SUCCESS:
      return { ...state, user: action.payload.user };
    case ActionTypes.SAVE_ELECTION_SUCCESS:
      return { ...state, isElectionSaved: true };
    case ActionTypes.SAVE_ELECTION_ERROR:
      return {
        ...state,
        isElectionSaved: false,
        saveElectionError: action.payload.error,
      };
    case ActionTypes.CREATE_COMPANY_NEWS_SUCCESS:
      return { ...state, companyNewsCreated: true };
    case ActionTypes.CREATE_COMPANY_NEWS_ERROR:
      return {
        ...state,
        companyNewsCreated: false,
        companyNewsError: action.payload.error,
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

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    electionCreated: false,
    electionError: null,
    isElectionSaved: false,
    saveElectionError: null,
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleAuthentication = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      dispatch({ type: ActionTypes.LOGOUT });
      return;
    }

    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      dispatch({ type: ActionTypes.LOGOUT });
      return;
    }

    const user = getStoredUser();
    dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
  }, [dispatch]);

  useEffect(() => {
    handleAuthentication();
  }, [handleAuthentication]);

  const handleLogin = useCallback(
    async (formData) => {
      try {
        const { token, user } = await login(formData);
        setStoredToken(token);
        setStoredUser(user);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
        navigate("/main");
        enqueueSnackbar("Login successful!", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.error || "Login failed. Please try again.",
          { variant: "error" }
        );
      }
    },
    [navigate, enqueueSnackbar, dispatch]
  );

  const handleLogout = useCallback(() => {
    removeStoredToken();
    removeStoredUser();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  }, [navigate, dispatch]);

  const useHandleRegister = () => {
    const handleRegister = async (formData) => {
      try {
        const response = await registerUser(formData);
        enqueueSnackbar("Registration successful!", { variant: "success" });
        dispatch({
          type: ActionTypes.REGISTER_SUCCESS,
          payload: { user: response.data.user },
        });
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.error ||
            "Registration failed. Please try again.",
          { variant: "error" }
        );
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
      enqueueSnackbar(
        error.response?.data?.error || "Registration failed. Please try again.",
        { variant: "error" }
      );
    }
  };

  const handleCreateElection = async (formData) => {
    try {
      const response = await createElection(formData);
      dispatch({
        type: ActionTypes.CREATE_ELECTION_SUCCESS,
        payload: response.election,
      });
      enqueueSnackbar("Election created successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.error || "Failed to create election",
        { variant: "error" }
      );
      dispatch({
        type: ActionTypes.CREATE_ELECTION_ERROR,
        payload: { error: error.message },
      });
    }
  };

  const updateTopicVote = async (userId, topicId, action) => {
    try {
      const response =
        action === "like"
          ? await topicLike(userId, topicId)
          : await dislikeTopicLike(userId, topicId);
      enqueueSnackbar(response.message || "Thank you for your vote!", {
        variant: "success",
      });
      return response;
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.error ||
          "Failed to process your vote. Please try again.",
        { variant: "error" }
      );
    }
  };

  const handleSaveElection = useCallback(
    async (electionId) => {
      try {
        const response = await saveElection(electionId);
        if (response.success) {
          dispatch({ type: ActionTypes.SAVE_ELECTION_SUCCESS });
          enqueueSnackbar("Elections saved successfully!", {
            variant: "success",
          });
        } else {
          enqueueSnackbar(
            response.error ||
              "An unknown error occurred while saving elections",
            { variant: "error" }
          );
          dispatch({
            type: ActionTypes.SAVE_ELECTION_ERROR,
            payload: { error: response.error },
          });
        }
      } catch (error) {
        enqueueSnackbar(
          error.message || "An error occurred while saving the elections",
          { variant: "error" }
        );
        dispatch({
          type: ActionTypes.SAVE_ELECTION_ERROR,
          payload: { error: error.message },
        });
      }
    },
    [enqueueSnackbar, dispatch]
  );

  const contextValue = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: !!state.user,
      handleLogin,
      handleLogout,
      handleSaveElection,
      useHandleRegister,
      handleCompanyRegister,
      handleCreateElection,
      updateTopicVote,
    }),
    [
      state.user,
      handleLogin,
      handleLogout,
      handleSaveElection,
      useHandleRegister,
      handleCompanyRegister,
      handleCreateElection,
      updateTopicVote,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

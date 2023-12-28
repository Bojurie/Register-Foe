import { useCallback, useContext } from "react";
import { AuthContext } from "../components/AuthContext/AuthContext";
import { login, registerCompany } from "../AuthAPI/AuthAPI";
import { useNavigate, useSnackbar } from "react-router-dom";
import {
  setStoredUser,
  setStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

export const useAuthActions = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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




  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
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

  const fetchUserByCompanyCode = async (companyCode) => {
    try {
      const response = await GetUsersByCode(companyCode);
      return response.data;
    } catch (error) {
      console.error("Error fetching topics:", error);
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

  const handleCreateTopic = async (topicData) => {
    try {
      const user = getStoredUser();
      if (!user || !user.token) {
        throw new Error("You must be logged in to create a topic.");
      }
      const response = await axios.post("/topic/topics", topicData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // Dispatch success action and show success message
    } catch (error) {
      // Dispatch error action and show error message
    }
  };



  // Other functions like handleLogout, handleRegister, etc.

  return { handleLogin /* ... other functions */ };
};

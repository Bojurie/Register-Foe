import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

import { login } from "./AuthAPI/AuthAPI""; // Ensure this import is correct
import {
  setStoredToken,
  setStoredUser,
} from "../LocalStorageManager/LocalStorageManager"; // Ensure these imports are correct
import { ActionTypes } from "./ActionTypes"; // Import or define your ActionTypes

const useHandleLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    async (formData) => {
      try {
        const response = await login(formData);

        if (!response.data || !response.data.token) {
          enqueueSnackbar(
            "Login failed: Token is missing or invalid response.",
            {
              variant: "error",
            }
          );
          return;
        }

        const { token, user, isCompany } = response.data;

        // Handle user data based on isCompany flag
        let userData;
        if (isCompany) {
          userData = { ...user, isCompany: true };
          // Perform actions specific to company user
        } else {
          userData = { ...user, isCompany: false };
          // Perform actions specific to individual user
        }

        // Securely store the token and user data
        setStoredToken(token);
        setStoredUser(userData);

        // Dispatch login success action
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user: userData },
        });

        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate("/main"); // Adjust this as per your app's requirement
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          error.response?.data?.error || "Login failed. Please try again.";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    },
    [navigate, dispatch, enqueueSnackbar]
  );
};

export default useHandleLogin;

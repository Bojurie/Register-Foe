import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // If you're using Redux
import { useSnackbar } from "notistack";

import { login } from "../AuthAPI/AuthAPI";
import {
  setStoredToken,
  setStoredUser,
} from "../LocalStorageManager/LocalStorageManager";
import { ActionTypes } from "../ActionTypes/ActionTypes";

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

        let userData;
        if (isCompany) {
          userData = { ...user, isCompany: true };
        } else {
          userData = { ...user, isCompany: false };
        }

        setStoredToken(token);
        setStoredUser(userData);

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

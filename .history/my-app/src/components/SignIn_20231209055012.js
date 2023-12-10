import React, { useState} from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { useAuth } from "./AuthContext/AuthContext";
import { setStoredUser } from "./LocalStorageManager/LocalStorageManager";
import LoginForm from "../components/LoginForm/LoginForm";

const Login = () => {
  const { login, fetchData } = useAuth();
  const [error, setError] = useState(""); // Add this line to define the 'setError' state

  const handleSubmit = async (formData) => {
    try {
      validateForm(formData);

      const { user } = await login(formData);
      setStoredUser({ id: user.id, username: user.username });

      // Fetch updated user data after login
      await fetchData();
    } catch (error) {
      handleLoginError(error);
    }
  };

  const validateForm = (formData) => {
    for (const key in formData) {
      if (!formData[key].trim()) {
        throw new Error("Please fill in all fields");
      }
    }
  };

  const handleLoginError = (error) => {
    if (error.response && error.response.data) {
      const errorMessage =
        error.response.data.error || "Invalid username or password.";
      console.error("Login failed:", errorMessage);
      setError(errorMessage);
    } else {
      console.error("Login failed: Unexpected error response", error.message);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 2 }}
      className="Login"
    >
      <h2>Login</h2>
      <LoginForm onSubmit={handleSubmit} />
      <div className="signIn_link">
        <TextLink to="/" text="Not a member? Register here" />
      </div>
    </motion.div>
  );
};

export default Login;
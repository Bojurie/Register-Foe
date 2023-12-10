import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { useAuth } from "./AuthContext/AuthContext";
import { setStoredUser } from "./LocalStorageManager/LocalStorageManager";
import LoginForm from "../components/LoginForm/LoginForm";

const Login = () => {
  const { login, fetchData } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
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
      console.error("Full error details:", error); // Add this line for more details
      setError("Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      validateForm(formData);

      const response = await login(formData);

      console.log("Login API Response:", response);

      // Check for the expected structure in the response
      if (
        !response ||
        typeof response.id === "undefined" ||
        typeof response.username === "undefined"
      ) {
        throw new Error("Invalid user data received");
      }

      // Fetch updated user data after login
      await fetchData();
    } catch (error) {
      handleLoginError(error);
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
      <LoginForm
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={formData}
        error={error}
      />

      <div className="signIn_link">
        <TextLink to="/" text="Not a member? Register here" />
      </div>
    </motion.div>
  );
};

export default Login;

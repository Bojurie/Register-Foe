// Login.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { useAuth } from "./AuthContext/AuthContext";
import { setStoredUser } from "./LocalStorageManager/LocalStorageManager";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, fetchData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (const key in formData) {
      if (!formData[key].trim()) {
        throw new Error("Please fill in all fields");
      }
    }
  };

const handleLoginError = (error) => {
  // Check if the error.response is defined and contains data
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      validateForm();

      const { user } = await login(formData);
      setStoredUser({ id: user.id, username: user.username });

      // Use navigate function to navigate to "/main"
      navigate("/main");

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
      <form onSubmit={handleSubmit} className="Form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="Form-Input"
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="Form-Input"
          />
        </label>

        <button type="submit" className="button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
        <div className="signIn_link">
          <TextLink to="/" text="Not a member? Register here" />
        </div>
      </form>
    </motion.div>
  );
};

export default Login;

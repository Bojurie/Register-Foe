// Login.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { loginUser } from "./AuthAPI/AuthAPI";
import { useAuth } from "./AuthContext/AuthContext";
import { setStoredUser } from "./LocalStorageManager/LocalStorageManager";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Declare navigate with const

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
    setError(error.response?.data?.error || "Invalid username or password.");

    if (Array.isArray(error.response?.data?.error)) {
      // If the error is an array (validation errors), join them into a string
      setError(error.response.data.error.join(", "));
    }

    console.error("Login failed:", error.response?.data || error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      validateForm();

      const { user } = await loginUser(formData);
      login(user);
      setStoredUser({ id: user.id, username: user.username });

      // Use navigate function to navigate to "/main"
      navigate("/main");
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

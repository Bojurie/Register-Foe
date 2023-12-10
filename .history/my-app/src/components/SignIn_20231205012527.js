import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import axios from "axios";
import "./signIn-page.css"; // Import your CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if fields are filled out
    if (!formData.username || !formData.password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      // Make API request to Express.js server (replace with your server endpoint)
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        formData
      );

      // Handle success, e.g., set user state, redirect, etc.
      console.log(response.data);
       window.location.href = "/main";
    } catch (error) {
      // Handle error, e.g., display error message
      console.error("Login failed:", error.response.data);
      setError("Invalid username or password.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="login-container"
    >
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
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
        <div className="signIn_link">
           <TextLink to="/" text="Not a member? Register here" />
        
        </div>
      </form>
    </motion.div>
  );
};

export default Login;

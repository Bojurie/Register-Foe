import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import axios from "axios";
import "./signIn-page.css";
import { useAuth } from "./AuthContext/AuthContext";

const Login = () => {
  const { login } = useAuth();
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
      console.log(response.data);

      // Update user state on successful login
      login(response.data.user);

      window.location.href = "/main";
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError("Invalid username or password.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="Login"
    >
      {/* ... your existing JSX */}
    </motion.div>
  );
};

export default Login;

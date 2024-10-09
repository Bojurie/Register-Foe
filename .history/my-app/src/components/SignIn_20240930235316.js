import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { useAuth } from "./AuthContext/AuthContext";
import LoginForm from "../components/LoginForm/LoginForm";
import "./Login.css"; // New CSS file for improved styles

const Login = () => {
  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isCompany: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await handleLogin(formData);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Failed to login. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 1.5 }}
      className="Login"
    >
      <div className="Login-Container">
        <h1>Sign In</h1>
        {error && <p className="Error-Message">{error}</p>}
        <LoginForm
          onSubmit={handleSubmit}
          onChange={handleChange}
          formData={formData}
        />
        <div className="SignIn-Link">
          <TextLink to="/register" text="Not a member? Register here" />
        </div>
      </div>
    </motion.div>
  );
};

export default Login;

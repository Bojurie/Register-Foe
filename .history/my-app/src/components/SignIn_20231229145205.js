import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import {  useAuth } from "./AuthContext/AuthContext";
import LoginForm from "../components/LoginForm/LoginForm";



const Login = () => {
  const { useHandleLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isCompany: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useHandleLogin();

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
      transition={{ duration: 2 }}
      className="Login"
    >
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <LoginForm
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={formData}
      />
      <div className="signIn_link">
        <TextLink to="/register" text="Not a member? Register here" />
      </div>
    </motion.div>
  );
};

export default Login;
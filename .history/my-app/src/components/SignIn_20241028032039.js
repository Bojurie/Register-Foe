import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { useAuth } from "./AuthContext/AuthContext";
import LoginForm from "../components/LoginForm/LoginForm";
import "./signIn.css";

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
          "Failed to login. Check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="login"
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 1 }}
    >
      <div className="loginContainer">
        <h1>Sign In</h1>
        {error && <p className="errorMessage">{error}</p>}
        <LoginForm
          onSubmit={handleSubmit}
          onChange={handleChange}
          formData={formData}
          isLoading={isLoading} 
        />
        <div className="signInLink">
          <TextLink to="/register" text="Not a member? Register here" />
        </div>
      </div>
    </motion.div>
  );
};

export default Login;

import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { useAuth } from "./AuthContext/AuthContext";
import LoginForm from "../components/LoginForm/LoginForm";

const Login = () => {
  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isCompany: false, 
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData, formData.isCompany);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to login. Please check your credentials.");
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
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
      <div>
        <LoginForm
          onSubmit={handleSubmit}
          type="checkbox"
          id="isCompany"
          name="isCompany"
          checked={formData.isCompany}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="isCompany">Login as Company</label>
      </div>

      <div className="signIn_link">
        <TextLink to="/" text="Not a member? Register here" />
      </div>
    </motion.div>
  );
};

export default Login;

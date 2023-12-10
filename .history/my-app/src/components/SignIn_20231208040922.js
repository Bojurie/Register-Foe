// Login.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { loginUser } from "./AuthAPI/AuthAPI";
import { useAuth } from "./AuthContext/AuthContext";
import { setStoredUser } from "./LocalStorageManager/LocalStorageManager";

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

    try {
      validateForm();

      const { user } = await loginUser(formData);
      login(user);
      setStoredUser({ id: user.id, username: user.username });
      window.location.href = "/main";
    } catch (error) {
      handleLoginError(error);
    }
  };

  const validateForm = () => {
    for (const key in formData) {
      if (!formData[key].trim()) {
        throw new Error("Please fill in all fields");
      }
    }
  };

  const handleLoginError = (error) => {
    setError(error.response?.data || "Invalid username or password.");
    console.error("Login failed:", error.response?.data || error.message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 2 }}
      className="Login"
    >
      {/* ... (rest of the component) */}
    </motion.div>
  );
};

export default Login;

// Form.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./Form.css";
import TextLink from "./TextLink";
import { registerUser } from "./AuthAPI/AuthAPI";

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await registerUser(formData);

      setSuccessMessage("Registration successful! You can now log in.");
      setError("");
    } catch (error) {
      setError(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 2 }}
      className="register-container"
    >
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (your existing form fields) */}
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit" className="reg-button">
          Register
        </button>
        <div className="signIn_link">
          <TextLink to="/login" text="Already a member? Login here" />
        </div>
      </form>
    </motion.div>
  );
};

export default Form;

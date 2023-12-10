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

    // Check if any field is empty
    const isAnyFieldEmpty = Object.values(formData).some((value) => value === "");

    if (isAnyFieldEmpty) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await registerUser(formData);

      setSuccessMessage("Registration successful! You can now log in.");
      setError("");
    } catch (error) {
      if (error.response?.data?.error === "User already exists") {
        setError("User already registered. Please log in.");
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
      setSuccessMessage("");
      console.error("Error during registration:", error);
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
        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
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

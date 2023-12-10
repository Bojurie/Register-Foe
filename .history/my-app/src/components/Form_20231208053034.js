import React, { useState } from "react";
import { motion } from "framer-motion";
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

    try {
      validateForm();

      await registerUser(formData);

      setSuccessMessage("Registration successful! You can now log in.");
      setError("");
    } catch (error) {
      handleRegistrationError(error);
    }
  };

  const validateForm = () => {
    for (const key in formData) {
      if (!formData[key].trim()) {
        throw new Error("Please fill in all fields");
      }
    }
  };

  const handleRegistrationError = (error) => {
    if (error.response?.data?.error === "Username already taken") {
      setError("Username already taken. Please choose another.");
    } else {
      setError(error.message || "Registration failed. Please try again.");
    }
    setSuccessMessage("");
    console.error("Error during registration:", error);
  };

  const renderFormInput = (label, name, type = "text") => (
    <div className="input-group" key={name}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );

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
        {renderFormInput("First Name", "firstName")}
        {renderFormInput("Last Name", "lastName")}
        {renderFormInput("Username", "username")}
        {renderFormInput("Email", "email", "email")}
        {renderFormInput("Password", "password", "password")}
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

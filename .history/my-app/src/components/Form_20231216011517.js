import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Form.css";
import TextLink from "./TextLink";
import { registerUser } from "./AuthAPI/AuthAPI";
import RegisterForm from "./RegisterForm/RegisterForm";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();

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
    const { name, value } = e.target || {};
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateForm();

      await registerUser(formData);

      setSuccessMessage("Registration successful! You can now log in.");
      setError("");

      // Redirect to the login route after successful registration
      navigate("/login");
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
    if (error.response?.data?.error) {
      setError(error.response.data.error);
    } else {
      setError("Registration failed. Please try again.");
    }
    setSuccessMessage("");
    console.error("Error during registration:", error);
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
      <RegisterForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
        successMessage={successMessage}
      />
      <div className="signIn_link">
        <TextLink to="/login" text="Already a member? Login here" />
      </div>
    </motion.div>
  );
};

export default Form;

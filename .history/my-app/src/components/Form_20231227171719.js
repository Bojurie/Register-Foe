import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Form.css";
import TextLink from "./TextLink";
import RegisterForm from "./RegisterForm/RegisterForm";
import { useAuth } from "./AuthContext/AuthContext";
// import { useHandleRegister } from "./AuthContext/AuthContext";

const Form = () => {
  const handleRegister = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    companyCode: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      validateForm();
      await handleRegister(formData);
      setSuccessMessage("Registration successful! You can now log in.");
      setError("");
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        companyCode: "",
      });
    } catch (error) {
      handleRegistrationError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) throw new Error("First Name is required");
    if (!formData.lastName.trim()) throw new Error("Last Name is required");
    if (!formData.username.trim()) throw new Error("Username is required");
    if (!formData.email.trim()) throw new Error("Email is required");
    if (!formData.password) throw new Error("Password is required");
    if (!/\S+@\S+\.\S+/.test(formData.email.trim()))
      throw new Error("Email is invalid");
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
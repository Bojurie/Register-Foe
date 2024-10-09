import React from "react";
import { motion } from "framer-motion";
import RegistrationForm from "./RegisterForm/RegisterForm";
import "./Form.css";

const Form = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container form-container"
    >
      <h2>Register</h2>
      <div className="form-content">
        <RegistrationForm />
      </div>
    </motion.div>
  );
};

export default Form;

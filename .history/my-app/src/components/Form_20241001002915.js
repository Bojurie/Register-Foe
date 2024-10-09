import React from "react";
import { motion } from "framer-motion";
import "./Form.css";
import TextLink from "./TextLink";
import RegistrationForm from "./RegisterForm/RegisterForm";

const Form = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 2 }}
      className="registerContainer"
    >
      <h1>Register</h1>
      <RegistrationForm />
      <div className="signInLink">
        <TextLink to="/login" text="Already a member? Login here" />
      </div>
    </motion.div>
  );
};

export default Form;

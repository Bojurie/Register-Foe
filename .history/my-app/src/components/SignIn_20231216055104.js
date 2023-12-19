import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { useAuth } from "./AuthContext/AuthContext";
import LoginForm from "../components/LoginForm/LoginForm";
import { loginUser } from "../components/AuthAPI/AuthAPI";

const Login = () => {
 const { loginUser } = useAuth();
 const [formData, setFormData] = useState({
   username: "",
   password: "",
 });
const { login } = useAuth();

const handleSubmit = async (formData) => {
  try {
    await loginUser(formData, login);
    // Additional logic if needed
  } catch (error) {
    console.error("Error during login:", error);
    // Handle error
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      <LoginForm
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={formData}
      />

      <div className="signIn_link">
        <TextLink to="/" text="Not a member? Register here" />
      </div>
    </motion.div>
  );
};

export default Login;

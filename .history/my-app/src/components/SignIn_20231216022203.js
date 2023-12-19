// Login.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { useAuth } from "./AuthContext/AuthContext";
import LoginForm from "../components/LoginForm/LoginForm";

const Login = () => {
  const { loginUser, fetchData } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleLoginError = (error) => {
  //   if (error.response && error.response.data) {
  //     setError(error.response.data.error || "Invalid username or password.");
  //   } else {
  //     setError("Login failed. Please try again.");
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const newUser = await fetchData()
      await loginUser(formData);
      await fetchData(); // Fetch updated user data after login
   } catch (error) {
    console.log(error);
    }
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

import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { AuthContext } from "./AuthContext/AuthContext";
import LoginForm from "../components/LoginForm/LoginForm";

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isCompany: false,
  });

const [error, setError] = useState("");

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Submitting form with:", formData);
    await handleLogin(formData);
  } catch (error) {
    console.error("Error during login:", error);
    setError(
      error.response?.data?.message ||
        error.message ||
        "Failed to login. Please check your credentials."
    );
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
      {error && <p className="error-message">{error}</p>}
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

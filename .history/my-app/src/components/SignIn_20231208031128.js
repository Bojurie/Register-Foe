import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import { loginUser } from "./AuthAPI/AuthAPI";
import { useAuth } from "./AuthContext/AuthContext";
import { setStoredUser } from './LocalStorageManager/LocalStorageManager';

// Your component logic here

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const { user } = await loginUser(formData);
      login(user);
      setStoredUser({ id: user.id, username: user.username });
      window.location.href = "/main";
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError("Invalid username or password.");
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
      <form onSubmit={handleSubmit} className="Form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="Form-Input"
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="Form-Input"
          />
        </label>

        <button type="submit" className="button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
        <div className="signIn_link">
          <TextLink to="/" text="Not a member? Register here" />
        </div>
      </form>
    </motion.div>
  );
};

export default Login;

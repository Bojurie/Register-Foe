import React, { useState } from "react";
import FormInput from "../FormInput";
import { useAuth } from "../AuthContext/AuthContext";

const LoginForm = () => {
  const { handleLogin } = useAuth(); // Use handleLogin from AuthContext
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData); // Call handleLogin with formData
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Username:"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <FormInput
        label="Password:"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default LoginForm;

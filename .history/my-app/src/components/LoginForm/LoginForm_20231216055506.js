import React, { useState } from "react";
import FormInput from "../FormInput";
import { useAuth } from "../AuthContext/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the login function from useAuth
      await login(formData);
      // Additional logic if needed
      setError(null); // Reset error state
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please try again."); // Set error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Username:"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <FormInput
        label="Password:"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default LoginForm;

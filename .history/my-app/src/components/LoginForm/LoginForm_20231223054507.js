import React, { useState } from "react";
import FormInput from "../FormInput";
import { useAuth } from "../AuthContext/AuthContext";

const LoginForm = () => {
  const { handleLogin } = useAuth(); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null); 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData); 
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
      <div className="form-group">
        <input
          type="checkbox"
          name="isCompany"
          id="isCompany"
          checked={formData.isCompany}
          onChange={handleChange}
        />
        <label htmlFor="isCompany">Login as Company</label>
      </div>
      <button type="submit">Submit</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default LoginForm;

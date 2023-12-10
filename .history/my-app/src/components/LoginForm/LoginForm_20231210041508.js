// LoginForm.js
import React from "react";
import FormInput from "../FormInput/FormInput";

const LoginForm = ({ onSubmit, onChange, formData, error }) => {
  const { username = "", password = "" } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Username:"
        name="username"
        value={username}
        onChange={onChange}
      />
      <FormInput
        label="Password:"
        name="password"
        type="password"
        value={password}
        onChange={onChange}
      />
      <button type="submit">Submit</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default LoginForm;

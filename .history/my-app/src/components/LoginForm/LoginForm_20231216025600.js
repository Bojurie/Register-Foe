import React from "react";
import FormInput from "../FormInput";

const LoginForm = ({ onSubmit, onChange, formData, error }) => {
  const { username = "", password = "" } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (onSubmit && typeof onSubmit === "function") {
        const user = await onSubmit(formData);
        if (user) {
          console.log("Login successful:", user);
        } else {
          console.log("Login failed");
        }
      } else {
        console.error("onSubmit is not a valid function");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
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

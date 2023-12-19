import React from "react";
import FormInput from "../FormInput";

const LoginForm = ({ onSubmit, onChange, formData, error }) => {
  const { username = "", password = "" } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform any necessary login-related actions in the parent component
      const user = await onSubmit(formData);

      // Handle the result of the login operation
      if (user) {
        console.log("Login successful:", user);
        // Optionally, you can perform additional actions after a successful login
      } else {
        console.log("Login failed");
        // Handle the case where login failed
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle login error
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

import React from "react";
import FormInput from "../FormInput";
import "./LoginForm.css";
import { Button } from "../StyledComponents";

const LoginForm = ({ onSubmit, onChange, formData, isLoading }) => {
  const { username = "", password = "", isCompany = false } = formData;

  return (
    <form onSubmit={onSubmit} className="loginForm">
      <FormInput
        label="Username"
        type="text"
        name="username"
        value={username}
        onChange={onChange}
        required
      />
      <FormInput
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        required
      />
      <div className="checkboxContainer">
        <input
          className="loginCheckbox"
          type="checkbox"
          name="isCompany"
          id="isCompany"
          checked={isCompany}
          onChange={onChange}
        />
        <label htmlFor="isCompany">Login as Company</label>
      </div>
      <Button type="submit" className="loginButton" disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
};

export default LoginForm;

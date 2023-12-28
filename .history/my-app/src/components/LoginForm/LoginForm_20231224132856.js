import React from "react";
import FormInput from "../FormInput";


const LoginForm = ({ onSubmit, onChange, formData }) => {
  const { username = "", password = "", isCompany = false } = formData || {};

  return (
    <form onSubmit={onSubmit}>
      <FormInput
        label="Username:"
        type="text"
        name="username"
        value={username}
        onChange={onChange}
        required
      />
      <FormInput
        label="Password:"
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        required
      />
      <div>
        <input
          type="checkbox"
          name="isCompany"
          id="isCompany"
          checked={isCompany}
          onChange={onChange}
        />
        <label htmlFor="isCompany">Login as Company</label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default LoginForm;
import React from "react";
import FormInput from "../FormInput";

const LoginForm = ({ onSubmit, onChange, formData }) => {
  return (
    <form onSubmit={onSubmit}>
      <FormInput
        label="Username:"
        type="text"
        name="username"
        value={formData.username}
        onChange={onChange}
      />
      <FormInput
        label="Password:"
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
      />
      <div>
        <input
          type="checkbox"
          name="isCompany"
          id="isCompany"
          checked={formData.isCompany}
          onChange={onChange}
        />
        <label htmlFor="isCompany">Login as Company</label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default LoginForm;

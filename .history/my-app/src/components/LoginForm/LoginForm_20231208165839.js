import React, { useState } from "react";

const LoginForm = ({ onSubmit, onChange, formData, error }) => {
  return (
    <form onSubmit={onSubmit} className="Form">
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onChange}
          className="Form-Input"
        />
      </label>

      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          className="Form-Input"
        />
      </label>

      <button type="submit" className="button">
        Login
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default LoginForm;

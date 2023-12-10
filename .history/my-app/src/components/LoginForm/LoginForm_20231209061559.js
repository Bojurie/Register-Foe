import React from "react";

const LoginForm = ({ onSubmit, onChange, formData, error }) => {
  // Destructure properties from formData with default values
  const { username = "", password = "" } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onSubmit function with the formData object
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChange}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default LoginForm;

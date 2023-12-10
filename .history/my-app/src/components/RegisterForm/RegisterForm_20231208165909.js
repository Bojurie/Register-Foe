import React from "react";
import FormInput from "../FormInput";
import ErrorMessage from "../ErrorMessage";
import SuccessMessage from "../SuccessMessage";

const RegisterForm = ({
  formData,
  onChange,
  onSubmit,
  error,
  successMessage,
}) => (
  <form onSubmit={onSubmit}>
    <FormInput
      label="First Name"
      name="firstName"
      value={formData.firstName}
      onChange={onChange}
    />
    <FormInput
      label="Last Name"
      name="lastName"
      value={formData.lastName}
      onChange={onChange}
    />
    <FormInput
      label="Username"
      name="username"
      value={formData.username}
      onChange={onChange}
    />
    <FormInput
      label="Email"
      name="email"
      type="email"
      value={formData.email}
      onChange={onChange}
    />
    <FormInput
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={onChange}
    />

    {error && <ErrorMessage message={error} />}
    {successMessage && <SuccessMessage message={successMessage} />}

    <button type="submit" className="reg-button">
      Register
    </button>
  </form>
);

export default RegisterForm;

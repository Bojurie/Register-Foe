import React, { useState } from "react";
import FormInput from "../FormInput";
import ErrorMessage from "../ErrorMessage";
import SuccessMessage from "../SuccessMessage";

const RegisterForm = ({
  formData,
  onChange,
  onSubmit,
  errors,
  successMessage,
}) => {
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleFieldError = (name, message) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: message }));
  };

  const handleFieldSuccess = (name) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  return (
    <form onSubmit={onSubmit}>
      <FormInput
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={(e) => {
          handleInputChange(e);
          handleFieldSuccess("firstName");
        }}
        onBlur={() => handleFieldError("firstName", "")}
      />
      {fieldErrors.firstName && (
        <ErrorMessage message={fieldErrors.firstName} />
      )}

      <FormInput
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={(e) => {
          handleInputChange(e);
          handleFieldSuccess("lastName");
        }}
        onBlur={() => handleFieldError("lastName", "")}
      />
      {fieldErrors.lastName && <ErrorMessage message={fieldErrors.lastName} />}

      <FormInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={(e) => {
          handleInputChange(e);
          handleFieldSuccess("username");
        }}
        onBlur={() => handleFieldError("username", "")}
      />
      {fieldErrors.username && <ErrorMessage message={fieldErrors.username} />}

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => {
          handleInputChange(e);
          handleFieldSuccess("email");
        }}
        onBlur={() => handleFieldError("email", "")}
      />
      {fieldErrors.email && <ErrorMessage message={fieldErrors.email} />}

      <FormInput
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={(e) => {
          handleInputChange(e);
          handleFieldSuccess("password");
        }}
        onBlur={() => handleFieldError("password", "")}
      />
      {fieldErrors.password && <ErrorMessage message={fieldErrors.password} />}

      {errors && <ErrorMessage message={errors} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <button type="submit" className="reg-button">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;

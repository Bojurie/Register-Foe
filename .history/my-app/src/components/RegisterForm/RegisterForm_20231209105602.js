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

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    onChange({ ...formData, [fieldName]: value });
  };

  const handleFieldError = (name, message) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: message }));
  };

  const handleFieldSuccess = (name) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    let hasError = false;
    const newFieldErrors = {};

    for (const field in formData) {
      if (!formData[field]) {
        newFieldErrors[field] = "This field is required.";
        hasError = true;
      }
    }

    setFieldErrors((prevErrors) => ({ ...prevErrors, ...newFieldErrors }));

    return !hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={(e) => {
          handleInputChange(e, "firstName");
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
          handleInputChange(e, "lastName");
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
          handleInputChange(e, "username");
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
          handleInputChange(e, "email");
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
          handleInputChange(e, "password");
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

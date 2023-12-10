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

  const validateForm = () => {
    const newFieldErrors = {};

    for (const field in formData) {
      if (!formData[field]) {
        newFieldErrors[field] = "This field is required.";
      }
    }

    setFieldErrors(newFieldErrors);

    return Object.keys(newFieldErrors).length === 0;
  };

  const handleBlur = (name) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
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
        onChange={(e) => handleInputChange(e, "firstName")}
        onBlur={() => handleBlur("firstName")}
      />
      {fieldErrors.firstName && (
        <ErrorMessage message={fieldErrors.firstName} />
      )}

      <FormInput
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={(e) => handleInputChange(e, "lastName")}
        onBlur={() => handleBlur("lastName")}
      />
      {fieldErrors.lastName && <ErrorMessage message={fieldErrors.lastName} />}

      <FormInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={(e) => handleInputChange(e, "username")}
        onBlur={() => handleBlur("username")}
      />
      {fieldErrors.username && <ErrorMessage message={fieldErrors.username} />}

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange(e, "email")}
        onBlur={() => handleBlur("email")}
      />
      {fieldErrors.email && <ErrorMessage message={fieldErrors.email} />}

      <FormInput
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange(e, "password")}
        onBlur={() => handleBlur("password")}
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

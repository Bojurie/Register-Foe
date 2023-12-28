import React, { useState } from "react";
import FormInput from "../FormInput";
import ErrorMessage from "../ErrorMessage";
import SuccessMessage from "../SuccessMessage";

const RegisterForm = ({
  formData,
  onChange,
  onSubmit,
  error,
  successMessage,
}) => {
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name, value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const handleBlur = (name) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newFieldErrors = {};
    const safeTrim = (value) => (typeof value === "string" ? value.trim() : "");

    if (!safeTrim(formData.firstName)) {
      newFieldErrors.firstName = "First Name is required";
    }
    if (!safeTrim(formData.lastName)) {
      newFieldErrors.lastName = "Last Name is required";
    }
    if (!safeTrim(formData.username)) {
      newFieldErrors.username = "Username is required";
    }
    if (!safeTrim(formData.email)) {
      newFieldErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newFieldErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newFieldErrors.password = "Password is required";
    }

    setFieldErrors(newFieldErrors);

    return Object.keys(newFieldErrors).length === 0;
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="First Name"
        placeholder="Enter your First Name ..."
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        onBlur={() => handleBlur("firstName")}
      />
      {fieldErrors.firstName && (
        <ErrorMessage message={fieldErrors.firstName} />
      )}

      <FormInput
        label="Last Name"
        placeholder="Enter your Last Name ..."
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        onBlur={() => handleBlur("lastName")}
      />
      {fieldErrors.lastName && <ErrorMessage message={fieldErrors.lastName} />}

      <FormInput
        label="Username"
        placeholder="Enter your username ..."
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        onBlur={() => handleBlur("username")}
      />
      {fieldErrors.username && <ErrorMessage message={fieldErrors.username} />}

      <FormInput
        label="Email"
        name="email"
        placeholder="Enter your email address ..."
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={() => handleBlur("email")}
      />
      {fieldErrors.email && <ErrorMessage message={fieldErrors.email} />}

      <FormInput
        label="Password"
        placeholder="Enter your password ..."
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        onBlur={() => handleBlur("password")}
      />
      {fieldErrors.password && <ErrorMessage message={fieldErrors.password} />}

      <FormInput
        label="Company Code"
        placeholder="Enter your company code ..."
        name="companyCode"
        value={formData.companyCode}
        onChange={handleInputChange}
        onBlur={() => handleBlur("companyCode")}
      />
      {fieldErrors.companyCode && (
        <ErrorMessage message={fieldErrors.companyCode} />
      )}

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <button type="submit" className="reg-button">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;

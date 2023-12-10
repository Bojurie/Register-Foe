// RegisterForm.js

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

  const handleBlur = (name) => {
    handleFieldError(name, ""); // Clear the error when onBlur
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
        onBlur={() => handleBlur("firstName")}
      />
      {fieldErrors.firstName && (
        <ErrorMessage message={fieldErrors.firstName} />
      )}

      {/* Repeat the pattern for other FormInput fields */}

      {errors && <ErrorMessage message={errors} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <button type="submit" className="reg-button">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;

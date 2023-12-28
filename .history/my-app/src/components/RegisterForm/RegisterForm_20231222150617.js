import React, {useState}from "react";
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
     const { name, value, type, checked } = e.target;
     if (type === "checkbox") {
       onChange({ target: { name, value: checked } });
     } else {
       onChange(e);
     }
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
     // Password is not trimmed because it can include leading/trailing spaces
     newFieldErrors.password = "Password is required";
   }

   if (formData.isAdmin && !safeTrim(formData.companyCode)) {
     newFieldErrors.companyCode = "Company Code is required for admins";
   }

    setFieldErrors(newFieldErrors);

    return Object.keys(newFieldErrors).length === 0;
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="First Name"
        placeholder="Please enter your First Name ..."
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
        placeholder="Please enter your Last Name ..."
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
        placeholder="Please enter your email address ..."
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={() => handleBlur("email")}
      />
      {fieldErrors.email && <ErrorMessage message={fieldErrors.email} />}

      <FormInput
        label="Password"
        placeholder="Please enter your password ..."
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        onBlur={() => handleBlur("password")}
      />
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

      <div className="checkbox-container">
        <input
          type="checkbox"
          id="isAdmin"
          name="isAdmin"
          checked={formData.isAdmin}
          onChange={handleInputChange}
        />
        <label htmlFor="isAdmin">Are you an admin?</label>
      </div>

      {formData.isAdmin && (
        <FormInput
          label="Admin Code"
          placeholder="Enter your 5-digit admin code ..."
          name="adminCode"
          value={formData.adminCode}
          onChange={handleInputChange}
          onBlur={() => handleBlur("adminCode")}
        />
      )}
      {fieldErrors.adminCode && (
        <ErrorMessage message={fieldErrors.adminCode} />
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
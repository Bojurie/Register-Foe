import React, { useState } from "react";
import "./CompanyRegistration.css";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const CompanyRegistration = () => {
  const { handleCompanyRegister, enqueueSnackbar } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyName: "",
    username: "",
    password: "",
    companyAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    companyEmail: "",
    phoneNumber: "",
    companyPhotoUrl: "",
    companyCode: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("companyAddress.")) {
      const addressField = name.split(".")[1];
      setCompanyData((prevState) => ({
        ...prevState,
        companyAddress: {
          ...prevState.companyAddress,
          [addressField]: value,
        },
      }));
    } else {
      setCompanyData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    [
      "companyName",
      "username",
      "password",
      "companyEmail",
      "phoneNumber",
      "companyCode",
    ].forEach((field) => {
      if (!companyData[field].trim()) {
        newErrors[field] = `${field} is required`;
        isValid = false;
      }
    });

    if (
      companyData.companyEmail &&
      !/\S+@\S+\.\S+/.test(companyData.companyEmail)
    ) {
      newErrors["companyEmail"] = "Invalid email format";
      isValid = false;
    }

    ["street", "city", "state", "zipCode"].forEach((field) => {
      if (!companyData.companyAddress[field].trim()) {
        newErrors[
          `companyAddress.${field}`
        ] = `Company address ${field} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await handleCompanyRegister(companyData);
      enqueueSnackbar("Company created successfully!", { variant: "success" });
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container company-registration-container"
    >
      <h2>Create a New Company</h2>
      <form onSubmit={handleSubmit} className="create-company-form">
        <div className="grid-container">
          <div className="form-item">
            <input
              name="companyName"
              value={companyData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="username"
              value={companyData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="password"
              value={companyData.password}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="companyAddress.street"
              value={companyData.companyAddress.street}
              onChange={handleChange}
              placeholder="Street Address"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="companyAddress.city"
              value={companyData.companyAddress.city}
              onChange={handleChange}
              placeholder="City"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="companyAddress.state"
              value={companyData.companyAddress.state}
              onChange={handleChange}
              placeholder="State"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="companyAddress.zipCode"
              value={companyData.companyAddress.zipCode}
              onChange={handleChange}
              placeholder="Zip Code"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="companyEmail"
              value={companyData.companyEmail}
              onChange={handleChange}
              placeholder="Company Email"
              type="email"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="phoneNumber"
              value={companyData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              type="tel"
              required
            />
          </div>
          <div className="form-item">
            <input
              name="companyPhotoUrl"
              value={companyData.companyPhotoUrl}
              onChange={handleChange}
              placeholder="Company Photo URL"
              type="url"
            />
          </div>
          <div className="form-item">
            <input
              name="companyCode"
              value={companyData.companyCode}
              onChange={handleChange}
              placeholder="Company Code"
              required
            />
          </div>
          {Object.keys(errors).map((key) =>
            errors[key] ? (
              <div key={key} className="error-message">
                {errors[key]}
              </div>
            ) : null
          )}
        </div>
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Creating..." : "Create Company"}
        </button>
      </form>
    </motion.div>
  );
};

export default CompanyRegistration;

import React, { useState, useContext } from "react";
import "./CompanyRegistration.css";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext/AuthContext"; 

const CompanyRegistration = () => {
  const { handleRegister } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [companyData, setCompanyData] = useState({
    companyName: "",
    username: "",
    password: "",
    companyAddress: "",
    CompanyEmail: "",
    phoneNumber: "",
    companyPhotoUrl: "",
    companyCode: "",
  });

  const handleChange = (e) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (const [key, value] of Object.entries(companyData)) {
      if (!value && key !== "companyPhotoUrl") {
        // 'companyPhotoUrl' is optional
        setError(`Please fill in the '${key}' field.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset any existing errors

    if (!validateForm()) return;

    try {
      await handleRegister(companyData, true); // true indicates it's a company
    } catch (error) {
      console.error("Failed to create company:", error);
      // Here you can handle specific error messages
      if (error.message.includes("E11000")) {
        // Duplicate key error code for MongoDB
        setError("Company code already exists. Please use a different code.");
      } else {
        setError(error.message || "Failed to create company");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mt-4 election-form-container"
    >
      <h2>Create a New Company</h2>
      <form onSubmit={handleSubmit} className="create-company-form">
        <input
          name="companyName"
          value={companyData.companyName}
          onChange={handleChange}
          placeholder="Company Name"
        />
        <input
          name="username"
          value={companyData.username}
          onChange={handleChange}
          placeholder="Username"
          type="text"
        />
        <input
          name="password"
          value={companyData.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
        />
        <input
          name="companyAddress"
          value={companyData.companyAddress}
          onChange={handleChange}
          placeholder="Company Address"
        />
        <input
          name="CompanyEmail"
          value={companyData.CompanyEmail}
          onChange={handleChange}
          placeholder="Company Email"
          type="email"
        />
        <input
          name="phoneNumber"
          value={companyData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          type="tel"
        />
        <input
          name="companyPhotoUrl"
          value={companyData.companyPhotoUrl}
          onChange={handleChange}
          placeholder="Company Photo URL"
          type="url"
        />
        <input
          name="companyCode"
          value={companyData.companyCode}
          onChange={handleChange}
          placeholder="Company Code"
        />
       <button type="submit" disabled={!validateForm()}>
                    Create Company
                </button>
                {error && <p className="error-message">{error}</p>}
        </form>
    </motion.div>
  );
};

export default CompanyRegistration;

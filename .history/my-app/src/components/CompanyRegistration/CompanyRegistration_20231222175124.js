import React, { useState } from "react";
import axios from "axios";
import "./CompanyRegistration.css"; 
import { motion } from "framer-motion";

const CompanyRegistration = () => {
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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const canSubmit = () => {
    // Updated validation logic to include username and password
    return (
      companyData.companyName &&
      companyData.username &&
      companyData.password &&
      companyData.companyCode &&
      companyData.CompanyEmail &&
      companyData.phoneNumber
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("/company/register", companyData);
      console.log(response.data); // Process the response as needed
      setError(""); // Clear any existing errors
    } catch (error) {
      console.error("Failed to create company:", error);
      setError(error.response?.data?.message || "Failed to create company");
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
        <button type="submit" disabled={!canSubmit()}>
          Create Company
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </motion.div>
  );
};

export default CompanyRegistration;

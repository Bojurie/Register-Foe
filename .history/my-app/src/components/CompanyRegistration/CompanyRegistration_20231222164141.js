import React, { useState } from "react";
import axios from "axios";
import "./CreateCompany.css"; // Assume you have a CSS file for styling

const CreateCompany = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
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
    // Basic validation logic here
    return (
      companyData.companyName &&
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
      const response = await axios.post("/api/companies", companyData);
      console.log(response.data); // Process the response as needed
      setError(""); // Clear any existing errors
    } catch (error) {
      console.error("Failed to create company:", error);
      setError(error.response?.data?.message || "Failed to create company");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-company-form">
      <input
        name="companyName"
        value={companyData.companyName}
        onChange={handleChange}
        placeholder="Company Name"
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
      />
      <input
        name="phoneNumber"
        value={companyData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      <input
        name="companyPhotoUrl"
        value={companyData.companyPhotoUrl}
        onChange={handleChange}
        placeholder="Company Photo URL"
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
  );
};

export default CreateCompany;

import React, { useState } from "react";

const CreateCompany = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyAddress: "",
    CompanyEmail: "",
    phoneNumber: "",
    companyPhotoUrl: "",
    companyCode: "",
  });

  const handleChange = (e) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/companies", {
        // Replace with your actual API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result); // Process the response as needed
    } catch (error) {
      console.error("Failed to create company:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Create Company</button>
    </form>
  );
};

export default CreateCompany;

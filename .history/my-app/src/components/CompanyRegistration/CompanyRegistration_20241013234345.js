import React, { useState } from "react";
import "./CompanyRegistration.css";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const CompanyRegistration = () => {
  const { handleCompanyRegister } = useAuth();
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

  // Handle input change for form fields
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

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    const requiredFields = [
      "companyName",
      "username",
      "password",
      "companyEmail",
      "phoneNumber",
      "companyCode",
    ];

    requiredFields.forEach((field) => {
      if (!companyData[field].trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    // Validate email format
    if (
      companyData.companyEmail &&
      !/\S+@\S+\.\S+/.test(companyData.companyEmail)
    ) {
      newErrors["companyEmail"] = "Invalid email format";
      isValid = false;
    }

    // Validate company address fields
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await handleCompanyRegister(companyData);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
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
          {[
            "companyName",
            "username",
            "password",
            "companyEmail",
            "phoneNumber",
            "companyCode",
          ].map((field, index) => (
            <div className="form-item" key={index}>
              <input
                name={field}
                value={companyData[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                type={field === "password" ? "password" : "text"}
                required
              />
              {errors[field] && (
                <div className="error-message">{errors[field]}</div>
              )}
            </div>
          ))}
          {["street", "city", "state", "zipCode"].map((field, index) => (
            <div className="form-item" key={index}>
              <input
                name={`companyAddress.${field}`}
                value={companyData.companyAddress[field]}
                onChange={handleChange}
                placeholder={`Company Address ${field}`}
                required
              />
              {errors[`companyAddress.${field}`] && (
                <div className="error-message">
                  {errors[`companyAddress.${field}`]}
                </div>
              )}
            </div>
          ))}
          <div className="form-item">
            <input
              name="companyPhotoUrl"
              value={companyData.companyPhotoUrl}
              onChange={handleChange}
              placeholder="Company Photo URL (Optional)"
              type="url"
            />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Creating..." : "Create Company"}
        </button>
      </form>
    </motion.div>
  );
};

export default CompanyRegistration;

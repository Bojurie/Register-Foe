import React, { useState, useContext } from "react";
import axios from "axios";
import "./ElectionRegistration.css";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router";

import { saveElection } from "../AuthAPI/AuthAPI"; // Ensure this is the correct path



function ElectionRegistrationForm() {
  const [formData, setFormData] = useState({
    electionName: "",
    electionType: "",
    electionStartDate: "",
    electionEndDate: "",
    electionDesc: "",
  });
  const { user } = useContext(AuthContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      alert("You must be logged in to create an election.");
      return;
    }

    // Validation for required fields
    const {
      electionName,
      electionType,
      electionStartDate,
      electionEndDate,
      electionDesc,
    } = formData;
    if (
      !electionName ||
      !electionType ||
      !electionStartDate ||
      !electionEndDate ||
      !electionDesc
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await saveElection(formData, user.token);
      alert("Election created successfully!");
      // Optional: navigate to another page or clear form
    } catch (error) {
      alert("Error creating election. Please try again.");
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
      <h2>Create a New Election</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="electionName" className="form-label">
            Election Name:
          </label>
          <input
            type="text"
            id="electionName"
            name="electionName"
            value={formData.electionName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="electionType" className="form-label">
            Election Type:
          </label>
          <input
            type="text"
            id="electionType"
            name="electionType"
            value={formData.electionType}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="electionStartDate" className="form-label">
            Election Start Date:
          </label>
          <input
            type="date"
            id="electionStartDate"
            name="electionStartDate"
            value={formData.electionStartDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="electionEndDate" className="form-label">
            Election End Date:
          </label>
          <input
            type="date"
            id="electionEndDate"
            name="electionEndDate"
            value={formData.electionEndDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="electionDesc" className="form-label">
            Election Description:
          </label>
          <textarea
            id="electionDesc"
            name="electionDesc"
            value={formData.electionDesc}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Election
        </button>
      </form>
    </motion.div>
  );
};

export default ElectionRegistrationForm;

import React, { useState,useEffect, useCallback } from "react";
import "./ElectionRegistration.css";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";


function ElectionRegistrationForm({ candidatesList }) {
  const { user, enqueueSnackbar, handleCreateElection } = useAuth();

  const initialFormData = {
    title: "",
    electionType: "",
    city: "",
    state: "",
    description: "",
    startDate: "",
    endDate: "",
    companyCode: user?.companyCode || "",
    candidates: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData((f) => ({
        ...f,
        companyCode: user.companyCode,
      }));
    }
  }, [user]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((f) => ({
      ...f,
      [name]: name === "startDate" || name === "endDate" ? value : value,
    }));
  }, []);

  const handleCandidateSelection = useCallback((event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setFormData((f) => ({
      ...f,
      candidates: selectedOptions,
    }));

    setSelectedCandidates(selectedOptions);
  }, []);

  const validateDates = () => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    return startDate < endDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      enqueueSnackbar("Start date must be before end date", {
        variant: "error",
      });
      return;
    }

    // Ensure all required fields are filled
    if (
      !formData.title ||
      !formData.electionType ||
      !formData.city ||
      !formData.state ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.description ||
      !formData.companyCode ||
      formData.candidates.length === 0 // Check if candidates array is empty
    ) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    try {
      await handleCreateElection(formData);
      enqueueSnackbar("Election created successfully!", { variant: "success" });
      setFormData(initialFormData);
      setSelectedCandidates([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create election";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className="container mt-4 election-form-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Create a New Election</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="companyCode" className="form-label">
            Company Code:
          </label>
          <input
            type="text"
            id="companyCode"
            name="companyCode"
            value={formData.companyCode}
            readOnly
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Election Name:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            Election City:
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="state" className="form-label">
            Election State:
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
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
          <label htmlFor="startDate" className="form-label">
            Election Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">
            Election End Date:
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="candidates" className="form-label">
            Select Candidates:
          </label>
          <select
            multiple
            id="candidates"
            name="candidates"
            onChange={handleCandidateSelection}
            value={selectedCandidates}
            className="form-control"
          >
            {candidatesList.map((candidate) => (
              <option key={candidate._id} value={candidate._id}>
                {candidate.firstName} {candidate.lastName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Election
        </button>
      </form>
    </motion.div>
  );
}

export default ElectionRegistrationForm;
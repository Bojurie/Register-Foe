import React, { useState, useCallback } from "react";
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((f) => ({
      ...f,
      [name]: name === "startDate" || name === "endDate" ? value : value,
    }));
  }, []);

  const handleCandidateSelection = useCallback((event) => {
    setSelectedCandidates(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
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

    if (
      !formData.title ||
      !formData.electionType ||
      !formData.city ||
      !formData.state ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.description ||
      !formData.companyCode
    ) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    setIsSubmitting(true); 

    try {
      await handleCreateElection({
        ...formData,
        candidates: selectedCandidates,
      });
      enqueueSnackbar("Election created successfully!", { variant: "success" });
      setFormData(initialFormData); 
      setSelectedCandidates([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create election";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsSubmitting(false); 
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
            className="form-control"
          >
            {candidatesList.map((candidate) => (
              <option key={candidate._id} value={candidate._id}>
                {candidate.firstName} {candidate.lastName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting} 
        >
          Create Election
        </button>
      </form>
    </motion.div>
  );
}

export default ElectionRegistrationForm;
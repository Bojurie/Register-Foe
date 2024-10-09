import React, { useState, useEffect, useCallback } from "react";
import "./ElectionRegistration.css";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";

function ElectionRegistrationForm({ candidatesList, onClose }) {
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
      [name]: value,
    }));
  }, []);

  const handleCandidateSelection = useCallback((event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCandidates(selectedOptions);
    setFormData((f) => ({
      ...f,
      candidates: selectedOptions,
    }));
  }, []);

  const validateDates = () => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    return startDate < endDate;
  };

  const isFormComplete = () => {
    return (
      formData.title &&
      formData.electionType &&
      formData.city &&
      formData.state &&
      formData.startDate &&
      formData.endDate &&
      formData.description &&
      formData.candidates.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      enqueueSnackbar("Start date must be before end date", {
        variant: "error",
      });
      return;
    }

    if (!isFormComplete()) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    try {
      await handleCreateElection(formData);
      enqueueSnackbar("Election created successfully!", { variant: "success" });
      setFormData(initialFormData);
      setSelectedCandidates([]);
      onClose();
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
      <form onSubmit={handleSubmit} className="election-form-grid">
        {[
          "title",
          "electionType",
          "city",
          "state",
          "startDate",
          "endDate",
          "description",
        ].map((field) => (
          <div className="form-item" key={field}>
            <label htmlFor={field} className="form-label">
              {field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              :
            </label>
            {field === "description" ? (
              <textarea
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="form-control"
              />
            ) : (
              <input
                type={field.includes("Date") ? "date" : "text"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="form-control"
              />
            )}
          </div>
        ))}
        <div className="form-item">
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
        <button
          type="submit"
          className="btn btn-primary form-item full-width"
          disabled={!isFormComplete()}
        >
          Create Election
        </button>
      </form>
    </motion.div>
  );
}

export default ElectionRegistrationForm;

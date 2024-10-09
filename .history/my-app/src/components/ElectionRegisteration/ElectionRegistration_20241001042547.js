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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        companyCode: user.companyCode,
      }));
    }
  }, [user]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleCandidateSelection = useCallback((event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCandidates(selectedOptions);
    setFormData((prevFormData) => ({
      ...prevFormData,
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
      formData.candidates.length > 0 &&
      validateDates()
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

    setLoading(true);
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
    } finally {
      setLoading(false);
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
        {[
          "companyCode",
          "title",
          "city",
          "state",
          "electionType",
          "startDate",
          "endDate",
          "description",
        ].map((field) => (
          <div className="mb-3" key={field}>
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
                min={
                  field.includes("Date")
                    ? new Date().toISOString().split("T")[0]
                    : undefined
                }
              />
            )}
          </div>
        ))}
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
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isFormComplete() || loading}
        >
          {loading ? "Creating..." : "Create Election"}
        </button>
      </form>
    </motion.div>
  );
}

export default ElectionRegistrationForm;

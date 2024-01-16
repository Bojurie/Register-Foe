import React, { useState, useEffect } from "react";
import "./ElectionRegistration.css";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";

function ElectionRegistrationForm() {
  const [formData, setFormData] = useState({
    electionName: "",
    electionType: "",
    electionStartDate: "",
    electionEndDate: "",
    electionDesc: "",
  });
  const [candidatesList, setCandidatesList] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const {
    user,
    fetchUserByCompanyCode,
    enqueueSnackbar,
    handleCreateElection,
  } = useAuth();

  useEffect(() => {
    // Fetch candidates if user and company code are available
    const fetchCandidates = async () => {
      if (user && user.companyCode) {
        try {
          const response = await fetchUserByCompanyCode(user.companyCode);
          setCandidatesList(response || []);
        } catch (error) {
          enqueueSnackbar("Failed to fetch candidates", { variant: "error" });
        }
      }
    };
    fetchCandidates();
  }, [user, enqueueSnackbar, fetchUserByCompanyCode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCandidateSelection = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCandidates(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      new Date(formData.electionStartDate) > new Date(formData.electionEndDate)
    ) {
      enqueueSnackbar("Start date must be before end date", {
        variant: "error",
      });
      return;
    }

    try {
      await handleCreateElection(
        { ...formData, candidates: selectedCandidates },
        user
      );
      enqueueSnackbar("Election created successfully!", { variant: "success" });
      setFormData({
        electionName: "",
        electionType: "",
        electionStartDate: "",
        electionEndDate: "",
        electionDesc: "",
      });
      setSelectedCandidates([]);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.error ||
          "Error creating election. Please try again.",
        { variant: "error" }
      );
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
        <div className="mb-3">
          <label htmlFor="candidates" className="form-label">
            Select Candidates:
          </label>
          <select
            multiple
            id="candidates"
            className="form-control"
            onChange={handleCandidateSelection}
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

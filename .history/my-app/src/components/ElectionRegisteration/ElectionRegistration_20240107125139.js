import React, { useState, useEffect } from "react";
import "./ElectionRegistration.css";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";


function ElectionRegistrationForm() {
  const {
    user,
    fetchUserByCompanyCode,
    enqueueSnackbar,
    handleCreateElection,
  } = useAuth();

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
  const [candidatesList, setCandidatesList] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    if (!user || !user.companyCode) {
      console.warn("User or company code is not available.");
      return;
    }

    try {
      const response = await fetchUserByCompanyCode(user.companyCode);
      if (!response || !response.data || !Array.isArray(response.data)) {
        console.error(
          "Failed to fetch candidates: No data returned or wrong format"
        );
        enqueueSnackbar("Failed to fetch candidates", { variant: "error" });
        return;
      }
      const candidatesFromResponse = response.data;
      setCandidatesList(candidatesFromResponse);

      setFormData((prevFormData) => ({
        ...prevFormData,
        companyCode: user.companyCode,
      }));
    } catch (error) {
      console.error("Error fetching candidates:", error);
      enqueueSnackbar(
        error.response?.data?.error || "Failed to fetch candidates",
        { variant: "error" }
      );
    }
  };

  fetchData();
}, [user, fetchUserByCompanyCode, enqueueSnackbar]);


   if (!user) {
     return <div>Loading...</div>; // Render a loading state or message when user data is not available
   }
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

    // Validation: Start date must be before end date
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      enqueueSnackbar("Start date must be before end date", {
        variant: "error",
      });
      return;
    }
    const electionData = {
      ...formData,
      candidates: selectedCandidates,
    };

    try {
      await handleCreateElection(electionData);
      enqueueSnackbar("Election created successfully!", { variant: "success" });
      setFormData(initialFormData);
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
          <label htmlFor="electionCity" className="form-label">
            Election City:
          </label>
          <input
            type="text"
            id="electionCity"
            name="electionCity"
            value={formData.electionCity}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="electionState" className="form-label">
            Election State:
          </label>
          <input
            type="text"
            id="electionState"
            name="electionState"
            value={formData.electionState}
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

        <button type="submit" className="btn btn-primary">
          Create Election
        </button>
      </form>
    </motion.div>
  );
}

export default ElectionRegistrationForm;
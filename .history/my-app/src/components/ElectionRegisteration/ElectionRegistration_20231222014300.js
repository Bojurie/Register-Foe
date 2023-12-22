import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./ElectionRegistration.css";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext/AuthContext";

const ElectionRegistrationForm = () => {
    const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    electionName: "",
    electionDate: "",
    constituency: "",
  });


   useEffect(() => {
     if (!user) {
       // Redirect or show a message if the user is not logged in
     }
   }, [user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 if (!user) {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      await axios.post("auth/election/create-election", formData, config);
    } catch (error) {
      // ... error handling
    }
  };
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
          <label htmlFor="electionDate" className="form-label">
            Election Date:
          </label>
          <input
            type="date"
            id="electionDate"
            name="electionDate"
            value={formData.electionDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="constituency" className="form-label">
            Constituency:
          </label>
          <input
            type="text"
            id="constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleChange}
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

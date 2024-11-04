import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./Testimony.css"; // Custom CSS for styling

const Testimony = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [testimony, setTestimony] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !position || !company || !testimony) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("/testimonies", {
        name,
        position,
        company,
        testimony,
      });

      if (response.status === 200) {
        setSuccess("Testimony submitted successfully!");
        setName("");
        setPosition("");
        setCompany("");
        setTestimony("");
        setError("");
      }
    } catch (err) {
      setError("Failed to submit testimony. Please try again.");
      setSuccess("");
    }
  };

  return (
    <motion.div
      className="testimony-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="testimony-heading">Post Testimony</h2>
      <p className="testimony-description">
        We’d love to hear your thoughts on how <span>We Elect</span> has
        impacted your company. Submit your testimony below!
      </p>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form className="testimony-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Your Position"
          />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your Company"
          />
        </div>
        <div className="form-group">
          <label htmlFor="testimony">Testimony</label>
          <textarea
            id="testimony"
            value={testimony}
            onChange={(e) => setTestimony(e.target.value)}
            placeholder="Write your testimony"
          ></textarea>
        </div>
        <button type="submit" className="cta-button">
          Submit Testimony
        </button>
      </form>
    </motion.div>
  );
};

export default Testimony;
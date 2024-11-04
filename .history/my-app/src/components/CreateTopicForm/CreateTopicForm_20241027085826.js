import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "./CreateTopicForm.css";
import { useAuth } from "../AuthContext/AuthContext";

const CreateTopicForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    dateStart: "",
    dateEnd: "",
    description: "",
    companyCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { handleCreateTopic } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setError(""); // Clear error on new input
  };

  const isFormValid = () => {
    const { title, description, companyCode, dateStart, dateEnd } = formData;
    if (!title || !description || !companyCode) {
      setError("Please fill in all fields.");
      return false;
    }
    if (new Date(dateStart) >= new Date(dateEnd)) {
      setError("End date must be after the start date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      await handleCreateTopic(formData);
      setFormData({
        title: "",
        dateStart: "",
        dateEnd: "",
        description: "",
        companyCode: "",
      });
      onClose(); // Close form on successful submit
    } catch {
      setError("Failed to create topic. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="form-container">
      <form onSubmit={handleSubmit} className="topic-form">
        <h2>Create New Topic</h2>
        {error && <p className="error-message">{error}</p>}
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="dateStart"
            value={formData.dateStart}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="dateEnd"
            value={formData.dateEnd}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Company Code:
          <input
            type="text"
            name="companyCode"
            value={formData.companyCode}
            onChange={handleInputChange}
            required
          />
        </label>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? "Creating..." : "Create Topic"}
        </motion.button>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </form>
    </motion.div>
  );
};

CreateTopicForm.propTypes = {
  onClose: PropTypes.func,
};

export default CreateTopicForm;

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
  const { handleCreateTopic, enqueueSnackbar } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const isFormValid = () => {
    const { title, description, companyCode, dateStart, dateEnd } = formData;
    if (!title || !description || !companyCode) {
      enqueueSnackbar("Please fill in all fields.", { variant: "error" });
      return false;
    }
    if (new Date(dateStart) >= new Date(dateEnd)) {
      enqueueSnackbar("End date must be after start date.", {
        variant: "error",
      });
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
      enqueueSnackbar("Topic created successfully!", { variant: "success" });
      setFormData({
        title: "",
        dateStart: "",
        dateEnd: "",
        description: "",
        companyCode: "",
      });
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to create topic", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="form-container">
      <form
        onSubmit={handleSubmit}
        className="topic-form"
        aria-labelledby="topic-form"
      >
        <h2 id="topic-form">Create New Topic</h2>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            aria-label="Title"
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
            aria-label="Start Date"
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
            aria-label="End Date"
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            aria-label="Description"
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
            aria-label="Company Code"
          />
        </label>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Submit"
        >
          {isSubmitting ? "Creating..." : "Create Topic"}
        </motion.button>
      </form>
      <button onClick={onClose} className="close-button" aria-label="Close">
        Close
      </button>
    </motion.div>
  );
};



export default CreateTopicForm;

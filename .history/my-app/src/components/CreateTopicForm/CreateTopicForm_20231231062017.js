import React, { useState } from "react";
import './CreateTopicForm.css'
import { motion } from "framer-motion";
import {useAuth } from "../AuthContext/AuthContext";



function CreateTopicForm({ onClose }) {
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
    if (!formData.title || !formData.description) {
      enqueueSnackbar("Please fill all fields.", { variant: "error" });
      return false;
    }
    if (!formData.companyCode) {
      enqueueSnackbar("Invalid company code.", { variant: "error" });
      return false;
    }
    if (new Date(formData.dateStart) > new Date(formData.dateEnd)) {
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
      onClose?.(); 
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ duration: 1 }}
      className="form-container"
    >
      <form onSubmit={handleSubmit} className="topic-form">
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Topic"}
        </motion.button>
      </form>
      <button onClick={onClose} className="close-button">
        Close
      </button>{" "}
    </motion.div>
  );
}

export default CreateTopicForm;
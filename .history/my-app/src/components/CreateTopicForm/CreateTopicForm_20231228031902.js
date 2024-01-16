import React, { useState, useContext,  } from "react";
import './CreateTopicForm.css'
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext/AuthContext";

function CreateTopicForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    dateStart: "",
    dateEnd: "",
    description: "",
    companyCode: "",
  });
  const { user, handleCreateTopic, enqueueSnackbar } = useContext(AuthContext);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "companyCode") {
      checkCompanyCode(value);
    }
  };

  const checkCompanyCode = async (code) => {
    if (code.length === 0) {
      setCompanyCodeValid(false);
      return;
    }
    try {
      const valid = await verifyCompanyCode(code); // This function should call your API endpoint
      setCompanyCodeValid(valid);
      setIsError(!valid);
      setMessage(valid ? "" : "Invalid company code.");
    } catch (error) {
      console.error("Error verifying company code:", error);
      setIsError(true);
      setMessage("Error verifying company code.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.companyCode) {
      enqueueSnackbar("Invalid company code.", { variant: "error" });
      return;
    }

    try {
      await handleCreateTopic(formData);
      setMessage("Topic created successfully!");
      setIsError(false);

      // Reset form state after successful submission
      setFormData({
        title: "",
        dateStart: "",
        dateEnd: "",
        description: "",
        companyCode: "",
      });

      // Close form after a delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      setMessage("Error submitting form: " + error.message);
      setIsError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
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
        >
          Create Topic
        </motion.button>
      </form>
      {message && (
        <div className={`message ${isError ? "error" : "success"}`}>
          {message}
        </div>
      )}
    </motion.div>
  );
}

export default CreateTopicForm;
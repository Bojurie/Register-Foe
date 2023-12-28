import React, { useState, useContext,  } from "react";
import './CreateTopicForm.css'
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext/AuthContext";
import { createTopic, verifyCompanyCode } from "../AuthAPI/AuthAPI";

function CreateTopicForm({ onClose }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [companyCodeValid, setCompanyCodeValid] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dateStart: "",
    dateEnd: "",
    description: "",
    companyCode: "",
  });
  const { user } = useContext(AuthContext);

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
    } catch (error) {
      console.error("Error verifying company code:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!companyCodeValid) {
      setMessage("Invalid company code.");
      setIsError(true);
      return;
    }

    try {
      const response = await createTopic(formData, user.token);
      setMessage("Topic created successfully!");
      setIsError(false);

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
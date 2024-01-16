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

    if (!companyCodeValid) {
      setIsError(true);
      return;
    }

    try {
      const response = await createTopic(formData, user.token);
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
        {/* Form fields with labels and inputs */}
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
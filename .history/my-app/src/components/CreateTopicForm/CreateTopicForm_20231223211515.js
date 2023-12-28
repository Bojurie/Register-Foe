import React, { useState, useContext,  } from "react";
import './CreateTopicForm.css'
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext/AuthContext";

function CreateTopicForm(onClose) {
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [formData, setFormData] = useState({
      title: "",
      dateStart: "",
      dateEnd: "",
      description: "",
    });
    const { user } = useContext(AuthContext);

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!user || !user.token || (!user.isCompany && !user.isAdmin)) {
        setMessage("Unauthorized: Only companies or admins can create topics");
        setIsError(true);
        return;
      }

      try {
        const response = await createTopic(formData, user.token);
        setMessage("Topic created successfully!");
        setIsError(false);
        console.log("Topic created:", response);

        setTimeout(() => {
          if (onClose) onClose(); // Close the form if onClose is provided
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
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null); // Added to differentiate error/success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    setIsSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      setFeedback(response.data.message);
      setIsSuccess(true); // Indicate success
    } catch (error) {
      setFeedback("Something went wrong. Please try again.");
      setIsSuccess(false); // Indicate error
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Name Field */}
        <motion.div
          className="form-group"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          className="form-group"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </motion.div>

        {/* Phone Field */}
        <motion.div
          className="form-group"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </motion.div>

        {/* Subject Field */}
        <motion.div
          className="form-group"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </motion.div>

        {/* Message Field */}
        <motion.div
          className="form-group form-message"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          className="submit-btn"
          type="submit"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.1 }}
        >
          {loading ? "Sending..." : "Submit"}
        </motion.button>
      </form>

      {/* Feedback Message */}
      {feedback && (
        <motion.p
          className={`feedback ${isSuccess ? "success" : "error"}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {feedback}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Contact;

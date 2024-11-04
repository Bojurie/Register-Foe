import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Contact.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      setFeedback(response.data.message);
    } catch (error) {
      setFeedback("Something went wrong. Please try again.");
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
        <motion.div
          className="form-group"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
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

        <motion.div
          className="form-group"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
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

        <motion.div
          className="form-group"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
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

        <motion.button
          className="submit-btn"
          type="submit"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.1 }}
        >
          {loading ? "Sending..." : "Submit"}
        </motion.button>
      </form>

      {feedback && <motion.p className="feedback">{feedback}</motion.p>}
    </motion.div>
  );
};

export default ContactPage;

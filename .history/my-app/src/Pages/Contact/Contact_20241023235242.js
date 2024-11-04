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
      <motion.h1
        className="contact-title"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Get in Touch
      </motion.h1>
      <motion.p
        className="contact-subtitle"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        We'd love to hear from you! Please fill out the form below.
      </motion.p>
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Name Field */}
        <motion.div
          className="form-group"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          className="form-group"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
        </motion.div>

        {/* Phone Field */}
        <motion.div
          className="form-group"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Phone Number"
            required
          />
        </motion.div>

        {/* Subject Field */}
        <motion.div
          className="form-group"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
          />
        </motion.div>

        {/* Message Field */}
        <motion.div
          className="form-group"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          className="submit-btn"
          type="submit"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.1 }}
        >
          {loading ? "Sending..." : "Submit"}
        </motion.button>
      </form>

      {feedback && <motion.p className="feedback">{feedback}</motion.p>}
    </motion.div>
  );
};

export default Contact;

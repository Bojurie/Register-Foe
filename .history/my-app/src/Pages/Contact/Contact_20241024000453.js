import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
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
      className="container contact-page mt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-center mb-5">Contact Us</h1>
      <form onSubmit={handleSubmit} className="row g-4">
        {/* Name Field */}
        <motion.div
          className="col-md-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
                {/* Email Field */}
      
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </motion.div>

        {/* Phone Field */}
        <motion.div
          className="col-md-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        

        {/* Subject Field */}
      
      
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            required
          />
        </motion.div>

        {/* Message Field */}
        <motion.div
          className="col-12"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
            rows="5"
            required
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          className="col-12 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.1 }}
        >
          <button className="btn btn-primary btn-lg" type="submit">
            {loading ? "Sending..." : "Submit"}
          </button>
        </motion.div>
      </form>

      {/* Feedback Message */}
      {feedback && (
        <motion.p
          className={`feedback mt-4 text-center animate__animated animate__fadeInUp ${
            isSuccess ? "text-success" : "text-danger"
          }`}
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

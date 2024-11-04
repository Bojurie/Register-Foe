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
  const [isSuccess, setIsSuccess] = useState(null);

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
      setIsSuccess(true);
    } catch (error) {
      setFeedback("Something went wrong. Please try again.");
      setIsSuccess(false);
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
      <div className="contact-container">
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-groups">
            <div className="contact-labelInput">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-labelInput">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-groups">
            <div className="contact-labelInput">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-labelInput">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn">
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>

        {feedback && (
          <motion.p
            className={`feedback ${isSuccess ? "success" : "error"}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {feedback}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Contact;

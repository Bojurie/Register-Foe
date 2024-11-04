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
      <motion.div
        className="contact-container"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <motion.div
            className="form-groups"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="contact-labelInput">
              <input
                type="text"
                id="name"
                placeholder="Full name ..."
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-labelInput">
              <input
                type="email"
                id="email"
                placeholder="Email address ..."
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </motion.div>

          <motion.div
            className="form-groups"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="contact-labelInput">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone Number ..."
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-labelInput">
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <textarea
              id="message"
              placeholder="Message ..."
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            ></textarea>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <button type="submit" className="submit-btn">
              {loading ? "Sending..." : "Submit"}
            </button>
          </motion.div>
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
      </motion.div>
    </motion.div>
  );
};

export default Contact;

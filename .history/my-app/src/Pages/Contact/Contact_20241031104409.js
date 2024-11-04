import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPaperPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./Contact.css";
import { Button } from "@mui/material";
import { FormContainer } from "../../components/StyledComponents";

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

  const iconVariant = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.6, repeat: 2 },
    },
  };

  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.FormContainer
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
            className="form-group submit-group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <motion.div
                  className="loading-icon"
                  variants={iconVariant}
                  initial="initial"
                  animate="animate"
                >
                  <FaPaperPlane size={20} />
                </motion.div>
              ) : (
                "Submit"
              )}
            </Button>
          </motion.div>
        </form>

        {feedback && (
          <motion.div
            className={`feedback ${isSuccess ? "success" : "error"}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {isSuccess ? (
              <FaCheckCircle className="feedback-icon success-icon" />
            ) : (
              <FaTimesCircle className="feedback-icon error-icon" />
            )}
            <p>{feedback}</p>
          </motion.div>
        )}
      </motion.FormContainer>
    </motion.div>
  );
};

export default Contact;

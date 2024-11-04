import React, { useState } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import { useAuth } from "../AuthContext/AuthContext";
import "./Testimony.css";

const Testimony = () => {
  const { postTestimony, user } = useAuth();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [testimony, setTestimony] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !position || !company || !testimony) {
      setError("All fields are required");
      return;
    }

    try {
      const formData = {
        name,
        position,
        company,
        testimony,
        userId: user?._id,
      };
      const response = await postTestimony(formData);

      if (response) {
        setSuccess("Testimony submitted successfully!");
        setName("");
        setPosition("");
        setCompany("");
        setTestimony("");
        setError("");
        closeModal();
      }
    } catch (err) {
      setError("Failed to submit testimony. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div>
      <div className="testimony-heading" onClick={openModal}>
        <h2>Post Testimony</h2>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modalContent"
        overlayClassName="modalOverlay"
        ariaHideApp={false}
      >
        <motion.div
          className="testimony-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h3 className="modal-title">Submit Your Testimony</h3>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form className="testimony-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Your Position"
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your Company"
              />
            </div>
            <div className="form-group">
              <label htmlFor="testimony">Testimony</label>
              <textarea
                id="testimony"
                value={testimony}
                onChange={(e) => setTestimony(e.target.value)}
                placeholder="Write your testimony"
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Testimony
            </motion.button>
          </form>
        </motion.div>
      </Modal>
    </div>
  );
};

export default Testimony;

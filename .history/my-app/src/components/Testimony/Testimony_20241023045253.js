import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Modal from "react-modal";
import "./Testimony.css"; // Custom CSS for styling

// Modal Styling
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "30px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "500px",
  },
};

const Testimony = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [testimony, setTestimony] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !position || !company || !testimony) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("/testimonies", {
        name,
        position,
        company,
        testimony,
      });

      if (response.status === 200) {
        setSuccess("Testimony submitted successfully!");
        setName("");
        setPosition("");
        setCompany("");
        setTestimony("");
        setError("");
        closeModal(); // Close modal upon success
      }
    } catch (err) {
      setError("Failed to submit testimony. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div>
      <button className="buttons" onClick={openModal}>
        Post Testimony
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Testimony Modal"
        ariaHideApp={false}
      >
        <motion.div
          className="testimony-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            <button type="submit" className="cta-button">
              Submit Testimony
            </button>
          </form>
        </motion.div>
      </Modal>
    </div>
  );
};

export default Testimony;

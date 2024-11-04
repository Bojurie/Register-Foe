import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext/AuthContext";
import "./Testimony.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "30px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    position: "relative",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

const Testimony = () => {
  const { postTestimony, user } = useAuth();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [testimony, setTestimony] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!name || !position || !company || !testimony) {
        toast.error("Please fill in all fields.");
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
          toast.success("Testimony submitted successfully!");
          setName("");
          setPosition("");
          setCompany("");
          setTestimony("");
          closeModal();
        }
      } catch (err) {
        toast.error("Failed to submit testimony. Please try again.");
      }
    },
    [name, position, company, testimony, user, postTestimony]
  );

  return (
    <div>
      <div className="testimony-heading" onClick={openModal}>
        <h2>Post Testimony</h2>
      </div>

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
          <button className="close-modal-button" onClick={closeModal}>
            &times;
          </button>
          <h3 className="modal-title">Submit Your Testimony</h3>

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

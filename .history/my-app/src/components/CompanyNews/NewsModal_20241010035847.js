import React from "react";
import { motion } from "framer-motion";
import "./NewsModal.css";

const NewsModal = ({ newsItem, onClose }) => {
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { type: "spring", stiffness: 120, delay: 0.2 },
    },
    exit: {
      y: "100vh",
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="news-modal-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="news-modal-content"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="news-modal-header">
          <h2>{newsItem.title}</h2>
          <p className="news-modal-date">
            {new Date(newsItem.date).toLocaleDateString()}
          </p>
        </div>
        <div className="news-modal-body">
          <p>{newsItem.content}</p>
          {newsItem.image && (
            <div className="news-modal-image">
              <img src={newsItem.image} alt={newsItem.title} />
            </div>
          )}
        </div>
        <div className="news-modal-footer">
          <button onClick={onClose} aria-label="Close Modal">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewsModal;

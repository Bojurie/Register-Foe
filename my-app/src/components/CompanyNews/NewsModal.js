import React from "react";
import { motion } from "framer-motion";
import "./NewsModal.css";

const NewsModal = ({ newsItem, onClose }) => {
  // Animation variants
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modal = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.5 } },
  };

  return (
    <motion.div
      className="news-modal"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div className="news-modal-content" variants={modal}>
        <div className="news-modal-header">
          <h2>{newsItem.title}</h2>
          <p>{new Date(newsItem.date).toLocaleDateString()}</p>
        </div>
        <div className="news-modal-body">
          <p>{newsItem.content}</p>
          <img src={newsItem.image} alt={newsItem.title} />
        </div>
        <div className="news-modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewsModal;

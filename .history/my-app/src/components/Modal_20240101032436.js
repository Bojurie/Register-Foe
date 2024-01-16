import React from "react";
import { motion } from "framer-motion";

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.3 }}
      >
        {children}
        <button onClick={onClose}>Close</button>
      </motion.div>
    </div>
  );
};

export default Modal;

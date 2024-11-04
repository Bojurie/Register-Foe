import React from "react";
import './Mode.css'
import { motion } from "framer-motion";
import { Button } from "./StyledComponents";

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
        <Button onClick={onClose}>Close</Button>
      </motion.div>
    </div>
  );
};

export default Modal;

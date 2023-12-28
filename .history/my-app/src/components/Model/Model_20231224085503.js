import React from "react";
import { motion } from "framer-motion";
import "./Model.css"

const Modal = ({ children, onClose, modalVariants }) => {
  return (
    <motion.div
      className="ModalBackdrop"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div className="ModalContent" onClick={(e) => e.stopPropagation()}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;

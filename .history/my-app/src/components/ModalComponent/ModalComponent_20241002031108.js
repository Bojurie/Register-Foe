import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import "./ModalComponent.css"; // Make sure to add necessary CSS

const ModalComponent = ({
  isModalOpen,
  setIsModalOpen,
  modalVariants,
  ContentComponent,
  contentProps = {},
}) => {
  return (
    <AnimatePresence>
      {isModalOpen && ContentComponent && (
        <motion.div
          className="ModalBackdrop"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="ModalContent"
            onClick={(e) => e.stopPropagation()} // Prevent modal closing on content click
          >
            <ContentComponent {...contentProps} />
            <button
              className="ModalCloseButton"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close Modal"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ModalComponent.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  modalVariants: PropTypes.object,
  ContentComponent: PropTypes.elementType.isRequired,
  contentProps: PropTypes.object,
};

ModalComponent.defaultProps = {
  modalVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  contentProps: {},
};

export default ModalComponent;

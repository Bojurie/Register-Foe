import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import "./ModalComponent.css";

const ModalComponent = ({
  isModalOpen,
  onClose,
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
          exit="hidden"
          key="modal-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="ModalContent full-screen"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            key="modal-content"
          >
            <ContentComponent {...contentProps} />
            <button
              className="ModalCloseButton"
              onClick={onClose}
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
  onClose: PropTypes.func.isRequired,
  modalVariants: PropTypes.object,
  ContentComponent: PropTypes.elementType.isRequired,
  contentProps: PropTypes.object,
};

ModalComponent.defaultProps = {
  modalVariants: {
    hidden: { opacity: 0, transition: { duration: 0.2 } },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  contentProps: {},
};

export default ModalComponent;

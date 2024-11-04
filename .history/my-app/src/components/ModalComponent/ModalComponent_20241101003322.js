import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import "./ModalComponent.css";
import { Button } from "../StyledComponents";

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
          exit="exit"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="ModalContent"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <ContentComponent {...contentProps} />
            <Button
              className="ModalCloseButton"
              onClick={onClose}
              aria-label="Close Modal"
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ModalComponent.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
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
  onClose: () => {},
  contentProps: {},
};

export default ModalComponent;

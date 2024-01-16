import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModalComponent = ({
  isModalOpen,
  setIsModalOpen,
  modalVariants,
  ContentComponent,
  contentProps = {},
}) => {
  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="ModalBackdrop"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={() => setIsModalOpen(false)}
      >
        <motion.div
          className="ModalContent"
          onClick={(e) => e.stopPropagation()}
        >
          <ContentComponent {...contentProps} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalComponent;

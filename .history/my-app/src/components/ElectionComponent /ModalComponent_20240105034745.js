import React from "react";

const ModalComponent = ({ isModalOpen, setIsModalOpen, children }) => {
  if (!isModalOpen) return null;

  return (
    <div className="ModalBackdrop" onClick={() => setIsModalOpen(false)}>
      <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default ModalComponent;

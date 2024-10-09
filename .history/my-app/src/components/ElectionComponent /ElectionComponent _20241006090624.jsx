import React, { useState } from "react";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import ModalComponent from "../ModalComponent/ModalComponent";
import { formatDate } from "../utils";

const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="ElectionComponent">
      <div className="ElectionComponent-Date" onClick={toggleModal}>
        <h3>{election.title || "Election Name Not Available"}</h3>
        <span>{formatDate(election.startDate)}</span> -{" "}
        <span>{formatDate(election.endDate)}</span>
      </div>

      {isModalOpen && (
        <ModalComponent
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <ElectionDetails election={election} />
        </ModalComponent>
      )}
    </div>
  );
};

export default ElectionComponent;

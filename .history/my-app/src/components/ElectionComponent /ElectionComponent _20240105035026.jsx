import React, { useState } from "react";
import ElectionDetails from "../ElectionItem/ElectionItem";
import Modal from "../Modal";

const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div>
      <div className="ElectionComponent" onClick={toggleModal}>
        <h2>{election.electionName || "Election Name Not Available"}</h2>
        <p>
          Date: {new Date(election.electionStartDate).toLocaleDateString()} to
          {new Date(election.electionEndDate).toLocaleDateString()}
        </p>
      </div>

      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <ElectionDetails election={election} />
        </Modal>
      )}
    </div>
  );
};

export default ElectionComponent;

import React, { useState } from "react";
import ElectionDetails from "../ElectionItem/ElectionItem";
import Modal from "../Modal";

const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    console.log("ElectionComponent clicked", election);
    setIsModalOpen(!isModalOpen);
  };

  // Debug: Log to check if the election object is received correctly
  console.log("Election Data:", election);

  return (
    <div>
      <div className="ElectionComponent" onClick={toggleModal}>
        {/* Use election.title or election.electionName based on your data */}
        <h2>{election.title || "Election Name Not Available"}</h2>
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
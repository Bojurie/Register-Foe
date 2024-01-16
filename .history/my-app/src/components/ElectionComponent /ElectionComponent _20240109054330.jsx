import React, { useState } from "react";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import Modal from "./Modal";

const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    console.log("ElectionComponent clicked", election);
    setIsModalOpen(!isModalOpen);
  };

  console.log("Election Data:", election);

  return (
    <div>
      <div className="ElectionComponent" onClick={toggleModal}>
        Use election.title or election.electionName based on your data
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
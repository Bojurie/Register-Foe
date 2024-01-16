import React, { useState } from "react";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import Modal from "./Modal";
import './ElectionComponent.css'

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
        <h2>{election.title || "Election Name Not Available"}</h2>
        <div className="ElectionComponent-Date">
          <span>
            {" "}
            Date: {new Date(election.startDate).toLocaleDateString()}
          </span>{" "}
          -<span>{new Date(election.endDate).toLocaleDateString()}</span>
        </div>

        <p></p>
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
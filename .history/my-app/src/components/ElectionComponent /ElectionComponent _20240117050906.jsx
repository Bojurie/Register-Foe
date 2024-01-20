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
    <div className="Elections-Right">
      <div className="ElectionComponent" onClick={toggleModal}>
        <div className="ElectionComponent-Date">
          <div>
            <h2>{election.title || "Election Name Not Available"}</h2>
          </div>
          <div>
            <span>
              {" "}
              Date: {new Date(election.startDate).toLocaleDateString()}
            </span>{" "}
            <span> -{new Date(election.endDate).toLocaleDateString()}</span>
          </div>
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
import React, { useState } from "react";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import Modal from "./Modal";
import './ElectionComponent.css'

const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="Elections-Right">
      <div className="ElectionComponent" onClick={toggleModal}>
        <div className="ElectionComponent-Date">
          <div>
            <h3>{election.title || "Election Name Not Available"}</h3>
          </div>
          <div>
            <span>{new Date(election.startDate).toLocaleDateString()}</span>{" "}
            <span>- {new Date(election.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <ElectionDetails
            election={election}
            candidates={election.candidates}
          />
        </Modal>
      )}
    </div>
  );
};

export default ElectionComponent;
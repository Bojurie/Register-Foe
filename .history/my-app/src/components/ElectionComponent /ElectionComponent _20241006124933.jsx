import React, { useState } from "react";
import "./ElectionComponent.css";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";

const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="ElectionComponent" onClick={toggleModal}>
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content">
        <p>{`${new Date(election.startDate).toLocaleDateString()} - ${new Date(
          election.endDate
        ).toLocaleDateString()}`}</p>
        <p>Election Type: {election.electionType}</p>
        <p>Candidates:</p>
        {election.candidates && election.candidates.length > 0 ? (
          <ul className="ElectionComponent-candidate">
            {election.candidates.map((candidate) => (
              <li key={candidate.id}>
                {candidate.firstName} {candidate.lastName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No candidates available for this election.</p>
        )}
      </div>

      {isModalOpen && (
        <ModalComponent
          isModalOpen={isModalOpen}
          onClose={toggleModal}
          ContentComponent={ElectionDetails}
          contentProps={{ election }}
        />
      )}
    </div>
  );
};

export default ElectionComponent;

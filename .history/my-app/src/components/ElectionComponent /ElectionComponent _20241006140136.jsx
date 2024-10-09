import React, { useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import "./ElectionComponent.css";

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
          <ul className="ElectionComponent-candidates">
            {election.candidates.map((candidate) =>
              candidate?.user ? (
                <li key={candidate.user._id}>
                  {candidate.user.firstName} {candidate.user.lastName}
                </li>
              ) : (
                <li key={candidate._id || Math.random()}>
                  Candidate details not available
                </li>
              )
            )}
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

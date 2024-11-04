import React, { useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import "./ElectionComponent.css";
import { FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";

const ElectionComponent = ({ election, postElectionVote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const electionId = election._id || election.id;

  const toggleModal = () => {
    if (election) {
      setIsModalOpen((prev) => !prev);
    }
  };

  const handleVote = async (candidateId) => {
    if (!electionId || !candidateId) {
      setVoteStatus("Invalid parameters for voting.");
      return;
    }

    try {
      const response = await postElectionVote(electionId, candidateId);
      if (response.error) {
        setVoteStatus(response.error);
      } else {
        setVoteStatus("Your vote has been successfully submitted!");
      }
    } catch (error) {
      setVoteStatus("An unknown error occurred. Please try again.");
    }
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
                <li key={candidate.user.id}>
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
          contentProps={{
            election,
            handleVote,
            voteStatus,
          }}
        />
      )}
    </div>
  );
};

export default ElectionComponent;

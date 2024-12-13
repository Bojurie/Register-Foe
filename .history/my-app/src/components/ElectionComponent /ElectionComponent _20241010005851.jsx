import React, { useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import "./ElectionComponent.css";

const ElectionComponent = ({ election, onVote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null); 

  const toggleModal = () => {
    if (election) {
      setIsModalOpen((prev) => !prev);
    }
  };

  const handleVote = async () => {
    try {
      const response = await onVote(election.id);
      if (response.error) {
        if (response.error === "ALREADY_VOTED") {
          setVoteStatus("You have already voted in this election.");
        } else if (response.error === "NOT_ELIGIBLE") {
          setVoteStatus("You are not eligible to vote in this election.");
        } else {
          setVoteStatus(
            "An error occurred while trying to vote. Please try again."
          );
        }
      } else {
        setVoteStatus("Your vote has been successfully submitted!");
      }
    } catch (error) {
      if (error.response) {
        setVoteStatus(error.response.data.message || "An error occurred.");
      } else if (error.request) {
        setVoteStatus(
          "No response from the server. Please check your network."
        );
      } else {
        setVoteStatus("An unknown error occurred. Please try again.");
      }
    }
  };


  return (
    <div className="ElectionComponent" onClick={toggleModal}>
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content">
        <p>
          {`${new Date(election.startDate).toLocaleDateString()} - ${new Date(
            election.endDate
          ).toLocaleDateString()}`}
        </p>
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
          contentProps={{ election, onVote: handleVote }}
        />
      )}
      {voteStatus && <div className="VoteStatusMessage">{voteStatus}</div>}
    </div>
  );
};

export default ElectionComponent;

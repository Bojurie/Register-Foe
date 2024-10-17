import React, { useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import "./ElectionComponent.css";
import axiosInstance from "../axiosInstance"; // Axios instance with authentication

const ElectionComponent = ({ election, postElectionVote, user }) => {
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

  const handleDelete = async () => {
    if (!electionId) return;

    try {
      const response = await axiosInstance.delete(`/election/${electionId}`);
      if (response.status === 200) {
        alert("Election deleted successfully.");
        // Optionally: refresh the election list or trigger re-fetch
      }
    } catch (error) {
      console.error("Error deleting election:", error);
      alert("Failed to delete the election.");
    }
  };

  return (
    <div className="ElectionComponent">
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content" onClick={toggleModal}>
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

      {user && (user.role === "Admin" || user.isCompany) && (
        <button className="DeleteButton" onClick={handleDelete}>
          Delete Election
        </button>
      )}

      {isModalOpen && (
        <ModalComponent
          isModalOpen={isModalOpen}
          onClose={toggleModal}
          ContentComponent={ElectionDetails}
          contentProps={{ election, handleVote, voteStatus }}
        />
      )}
    </div>
  );
};

export default ElectionComponent;

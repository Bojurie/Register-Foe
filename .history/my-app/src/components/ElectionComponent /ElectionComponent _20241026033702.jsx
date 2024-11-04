import React, { useState, useEffect } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import axiosInstance from "../axiosInstance";
import "./ElectionComponent.css";

const ElectionComponent = ({ election, postElectionVote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [ranking, setRanking] = useState([]);

  const electionId = election._id || election.id;

  const toggleModal = () => {
    if (election) setIsModalOpen((prev) => !prev);
  };

  const handleVote = async (candidateId) => {
    if (!electionId || !candidateId) {
      setVoteStatus("Invalid parameters for voting.");
      return;
    }

    try {
      const response = await postElectionVote(electionId, candidateId);
      setVoteStatus(
        response.error
          ? response.error
          : "Your vote has been successfully submitted!"
      );
    } catch {
      setVoteStatus("An unknown error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (election.candidates?.length) {
      const sortedCandidates = [...election.candidates].sort(
        (a, b) => b.votes - a.votes
      );
      setRanking(sortedCandidates);
    }
  }, [election.candidates]);

  return (
    <div className="ElectionComponent">
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content" onClick={toggleModal}>
        <p>{`${new Date(election.startDate).toLocaleDateString()} - ${new Date(
          election.endDate
        ).toLocaleDateString()}`}</p>
        <p>Election Type: {election.electionType}</p>
        <div className="candidates-ranking">
          {ranking.map((candidate, index) => (
            <motion.div
              key={candidate.user.id}
              className={`candidate-card ${index === 0 ? "leading" : ""}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4>
                {index === 0 ? (
                  <FontAwesomeIcon icon={faTrophy} className="leading-icon" />
                ) : (
                  <FontAwesomeIcon icon={faMedal} className="medal-icon" />
                )}
                {candidate.user.firstName} {candidate.user.lastName}
              </h4>
              <p>{candidate.votes} Votes</p>
              {index === 0 && (
                <p className="leading-label">Currently Leading</p>
              )}
            </motion.div>
          ))}
        </div>
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
            handleDeleteElection: async () => {
              try {
                await axiosInstance.delete(`/election/elections/${electionId}`);
                alert("Election deleted successfully.");
              } catch {
                alert("Failed to delete election. Please try again.");
              }
            },
          }}
        />
      )}
      {voteStatus && (
        <motion.div
          className={`VoteStatusMessage ${
            voteStatus.includes("success") ? "success" : "error"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {voteStatus}
        </motion.div>
      )}
    </div>
  );
};

export default ElectionComponent;

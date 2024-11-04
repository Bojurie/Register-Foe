import React, { useState, useEffect } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./ElectionComponent.css";

const ElectionComponent = ({ election, postElectionVote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [rankedCandidates, setRankedCandidates] = useState([]);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleVote = async (candidateId) => {
    try {
      const response = await postElectionVote(election.id, candidateId);
      setVoteStatus(response.error || "Vote submitted successfully!");
    } catch {
      setVoteStatus("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (election.candidates) {
      const sortedCandidates = [...election.candidates].sort(
        (a, b) => b.votes - a.votes
      );
      setRankedCandidates(sortedCandidates);
    }
  }, [election.candidates]);

  return (
    <motion.div
      className="election-container"
      onClick={toggleModal}
      whileHover={{ scale: 1.02 }}
    >
      <div className="election-header">
        <h2 className="election-title">{election.title}</h2>
        <p className="election-type">{election.electionType}</p>
      </div>

      <div className="election-details">
        <div className="details-dates">
          <p>
            <span>Start:</span>{" "}
            {new Date(election.startDate).toLocaleDateString()}
          </p>
          <p>
            <span>End:</span> {new Date(election.endDate).toLocaleDateString()}
          </p>
        </div>
        <p className="location">
          <span>Location:</span> {election.city}, {election.state}
        </p>
        <p className="description">{election.description}</p>
      </div>

      {rankedCandidates.length > 0 && (
        <div className="candidates-section">
          <motion.div
            className="leading-candidate"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faTrophy} className="icon trophy-icon" />
            <p>
              <strong>Leading:</strong> {rankedCandidates[0].user.firstName}{" "}
              {rankedCandidates[0].user.lastName} -{" "}
              {(
                (rankedCandidates[0].votes / election.totalVotes) *
                100
              ).toFixed(2)}
              %
            </p>
          </motion.div>

          <ul className="candidate-list">
            {rankedCandidates.slice(1).map((candidate, index) => (
              <motion.li
                key={candidate.user.id}
                className="candidate-item"
                whileHover={{ scale: 1.05 }}
              >
                <span>
                  {index + 2}. {candidate.user.firstName}{" "}
                  {candidate.user.lastName} -{" "}
                  {((candidate.votes / election.totalVotes) * 100).toFixed(2)}%
                </span>
                <FontAwesomeIcon icon={faMedal} className="icon medal-icon" />
              </motion.li>
            ))}
          </ul>
        </div>
      )}

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
    </motion.div>
  );
};

export default ElectionComponent;

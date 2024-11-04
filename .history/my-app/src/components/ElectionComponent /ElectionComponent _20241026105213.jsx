import React, { useState, useEffect } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faMedal,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./ElectionComponent.css";

const ElectionComponent = ({ election, postElectionVote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [tieCandidates, setTieCandidates] = useState([]);
  const [currentLeader, setCurrentLeader] = useState(null);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleVote = async (candidateId) => {
    const electionId = election._id || election.id;
    const currentDate = new Date();

    const isVotingAllowed =
      currentDate >= new Date(election.startDate) &&
      currentDate <= new Date(election.endDate);

    if (!isVotingAllowed) {
      setVoteStatus("Voting is not allowed at this time.");
      return;
    }

    if (!electionId || !candidateId) {
      setVoteStatus("Invalid parameters. Please try again.");
      return;
    }

    try {
      const response = await postElectionVote(electionId, candidateId);
      setVoteStatus(response.error || "Vote submitted successfully!");
    } catch (error) {
      setVoteStatus("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (election.candidates) {
      const sortedCandidates = [...election.candidates].sort(
        (a, b) => b.votes - a.votes
      );
      setRankedCandidates(sortedCandidates);

      const highestVoteCount = sortedCandidates[0]?.votes || 0;
      const ties = sortedCandidates.filter(
        (candidate) => candidate.votes === highestVoteCount
      );
      setTieCandidates(ties.length > 1 ? ties : []);
      setCurrentLeader(ties.length === 1 ? ties[0] : null);
    }
  }, [election.candidates]);

  return (
    <motion.div className="election-container" onClick={toggleModal}>
      <h2>{election.title}</h2>
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
        <p>
          <span>Type:</span> {election.electionType}
        </p>
        <p>
          <span>Location:</span> {election.city}, {election.state}
        </p>
        <p>
          <span>Description:</span> {election.description}
        </p>
      </div>

      {rankedCandidates.length > 0 && (
        <div className="candidates-section">
          {tieCandidates.length > 1 ? (
            <motion.div
              className="tie-announcement"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FontAwesomeIcon icon={faHandshake} className="icon tie-icon" />
              <p>
                <strong>Tied for Leading:</strong>
              </p>
              <ul>
                {tieCandidates.map((candidate) => (
                  <li key={candidate.user.id}>
                    {candidate.user.firstName} {candidate.user.lastName} -{" "}
                    {((candidate.votes / election.totalVotes) * 100).toFixed(2)}
                    %
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            currentLeader && (
              <motion.div
                className="leading-candidate"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FontAwesomeIcon icon={faTrophy} className="icon trophy-icon" />
                <p>
                  <strong>Currently Leading:</strong>{" "}
                  {currentLeader.user.firstName} {currentLeader.user.lastName} -{" "}
                  {((currentLeader.votes / election.totalVotes) * 100).toFixed(
                    2
                  )}
                  %
                </p>
              </motion.div>
            )
          )}

          <ul className="candidate-list">
            {rankedCandidates.map((candidate, index) => (
              <motion.li
                key={candidate.user.id}
                className="candidate-item"
                whileHover={{ scale: 1.05 }}
              >
                <span>
                  {index + 1}. {candidate.user.firstName}{" "}
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

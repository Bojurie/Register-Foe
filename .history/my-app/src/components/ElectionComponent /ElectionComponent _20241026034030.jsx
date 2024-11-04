import React, { useState, useEffect } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./ElectionComponent.css";
import axiosInstance from "../axiosInstance";

const ElectionComponent = ({ election, postElectionVote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [rankedCandidates, setRankedCandidates] = useState([]);

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

  useEffect(() => {
    if (election.candidates) {
      const ranked = [...election.candidates].sort((a, b) => b.votes - a.votes);
      setRankedCandidates(ranked);
    }
  }, [election.candidates]);

  return (
    <div className="ElectionComponent" onClick={toggleModal}>
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content">
        <p>{`${new Date(election.startDate).toLocaleDateString()} - ${new Date(
          election.endDate
        ).toLocaleDateString()}`}</p>
        <p>Election Type: {election.electionType}</p>

        {rankedCandidates.length > 0 ? (
          <div className="candidate-ranking">
            <motion.div
              className="leading-candidate"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>
                <FontAwesomeIcon icon={faTrophy} className="leader-icon" />
                Leading Candidate: {rankedCandidates[0].user.firstName}{" "}
                {rankedCandidates[0].user.lastName} -{" "}
                {(
                  (rankedCandidates[0].votes / election.totalVotes) *
                  100
                ).toFixed(2)}
                %
              </h3>
            </motion.div>
            <ul className="ElectionComponent-candidates">
              {rankedCandidates.slice(1).map((candidate, index) => (
                <motion.li
                  key={candidate.user.id}
                  className="candidate-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span>
                    {index + 2}. {candidate.user.firstName}{" "}
                    {candidate.user.lastName} -{" "}
                    {((candidate.votes / election.totalVotes) * 100).toFixed(2)}
                    %
                  </span>
                  <FontAwesomeIcon icon={faMedal} className="rank-icon" />
                </motion.li>
              ))}
            </ul>
          </div>
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

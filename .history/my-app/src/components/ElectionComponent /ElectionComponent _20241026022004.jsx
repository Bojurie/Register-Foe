import React, { useState, useEffect } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import { FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import "./ElectionComponent.css";

const ElectionComponent = ({ election, postElectionVote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [candidates, setCandidates] = useState(election.candidates);
  const electionId = election._id || election.id;

  // Calculate the vote percentage for each candidate
  const calculateVotePercentage = (votes, totalVotes) =>
    totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : "0.00";

  useEffect(() => {
    // Function to calculate and update vote percentages for each candidate
    const updateCandidatePercentages = () => {
      const totalVotes = candidates.reduce(
        (sum, candidate) => sum + candidate.votes,
        0
      );
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) => ({
          ...candidate,
          votePercentage: calculateVotePercentage(candidate.votes, totalVotes),
        }))
      );
    };
    updateCandidatePercentages();
  }, [candidates]);

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
        // Assuming the API returns updated vote counts for each candidate
        setCandidates(response.updatedCandidates);
      }
    } catch (error) {
      setVoteStatus("An unknown error occurred. Please try again.");
    }
  };

  // Identify the current leader
  const currentLeader = candidates.reduce((max, candidate) =>
    candidate.votes > max.votes ? candidate : max
  );

  return (
    <div className="ElectionComponent" onClick={toggleModal}>
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content">
        <p>{`${new Date(election.startDate).toLocaleDateString()} - ${new Date(
          election.endDate
        ).toLocaleDateString()}`}</p>
        <p>Election Type: {election.electionType}</p>
        <p>Candidates:</p>
        <ul className="ElectionComponent-candidates">
          {candidates.map((candidate) => (
            <motion.li
              key={candidate._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="candidate-item"
            >
              {candidate.user.firstName} {candidate.user.lastName}
              {currentLeader._id === candidate._id && (
                <motion.span
                  className="trophy-icon"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1.2 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                >
                  <FaTrophy />
                </motion.span>
              )}
              <motion.span
                className="vote-percentage"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {candidate.votePercentage}% of votes
              </motion.span>
            </motion.li>
          ))}
        </ul>
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

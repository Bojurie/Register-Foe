import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal } from "@fortawesome/free-solid-svg-icons";
import "./ElectionComponent.css";

const ElectionComponent = ({ election, postElectionVote }) => {
  const [voteStatus, setVoteStatus] = useState(null);
  const [rankedCandidates, setRankedCandidates] = useState([]);

  useEffect(() => {
    if (election.candidates) {
      const ranked = [...election.candidates].sort((a, b) => b.votes - a.votes);
      setRankedCandidates(ranked);
    }
  }, [election.candidates]);

  const handleVote = async (candidateId) => {
    const response = await postElectionVote(election._id, candidateId);
    setVoteStatus(response.error || "Vote successfully submitted!");
  };

  return (
    <div className="ElectionComponent">
      <h2>{election.title}</h2>
      <div className="ElectionComponent-details">
        <p><span>Type:</span> {election.electionType}</p>
        <p><span>Location:</span> {election.city}, {election.state}</p>
        <p><span>Description:</span> {election.description}</p>
      </div>
      <div className="candidate-ranking">
        <motion.div className="leading-candidate" animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h3>
            <FontAwesomeIcon icon={faTrophy} /> Leading: {rankedCandidates[0]?.user.firstName} {rankedCandidates[0]?.user.lastName}
          </h3>
        </motion.div>
        <ul>
          {rankedCandidates.map((candidate, index) => (
            <li key={candidate.user.id}>
              <span>{index + 1}. {candidate.user.firstName} {candidate.user.lastName}</span>
              <FontAwesomeIcon icon={faMedal} />
            </li>
          ))}
        </ul>
      </div>
      {voteStatus && <p>{voteStatus}</p>}
    </div>
  );
};

export default ElectionComponent;

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./ElectionComponent.css";

const ElectionComponent = ({ election }) => {
  const { postElectionVote, getElectionById } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (election?.candidates) {
      setCandidates(election.candidates);
    }
  }, [election]);

  const handleVote = async (candidateId) => {
    try {
      setIsLoading(true);
      await postElectionVote(election._id, candidateId);
      alert("Vote cast successfully");
      // Refresh the election data to get updated vote count
      await fetchElectionData(election._id);
    } catch (error) {
      setError("Failed to cast vote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchElectionData = useCallback(
    async (electionId) => {
      try {
        const updatedElection = await getElectionById(electionId);
        setCandidates(updatedElection.candidates);
      } catch (error) {
        setError("Error fetching updated election data.");
      }
    },
    [getElectionById]
  );

  return (
    <div className="ElectionComponent">
      <h2>{election.title}</h2>
      <div className="CandidatesList">
        {candidates.map((candidate) => (
          <div key={candidate.candidateId} className="CandidateItem">
            <p>
              Candidate ID: {candidate.candidateId} - Votes:{" "}
              {candidate.voteCount}
            </p>
            <p>
              Percentage:{" "}
              {election.totalVotes > 0
                ? ((candidate.voteCount / election.totalVotes) * 100).toFixed(2)
                : 0}
              %
            </p>
            <button
              onClick={() => handleVote(candidate.candidateId)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Vote"}
            </button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ElectionComponent;

import React, { useState, useEffect } from "react";
import axios from "axios";

const ElectionComponent = ({ election }) => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCandidates(election.candidates);
  }, [election]);

  const handleVote = async (candidateId) => {
    try {
      await axios.post(`/elections/${election._id}/vote`, { candidateId });
      alert("Vote cast successfully");
      // Refresh the election data to get updated vote count
      fetchElectionData();
    } catch (error) {
      setError("Failed to cast vote. Please try again.");
    }
  };

  const fetchElectionData = async () => {
    try {
      const response = await axios.get(`/elections/${election._id}`);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("Error fetching election data:", error);
    }
  };

  return (
    <div>
      <h2>{election.title}</h2>
      <div>
        {candidates.map((candidate) => (
          <div key={candidate.candidateId}>
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
            <button onClick={() => handleVote(candidate.candidateId)}>
              Vote
            </button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ElectionComponent;

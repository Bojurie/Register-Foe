import React, { useState, useEffect } from "react";
import Profile from "../Profile/Profile";
import "./ElectionDetails.css";

const ElectionDetails = ({ election, handleVote, voteStatus }) => {
  const [currentLeader, setCurrentLeader] = useState(null);
  const [isElectionEnded, setIsElectionEnded] = useState(false);
  const [voteCounts, setVoteCounts] = useState(
    election.candidates.map((candidate) => candidate.votes)
  );
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const now = new Date();
    const endDate = new Date(election.endDate);
    setIsElectionEnded(now > endDate);

    const total = election.candidates.reduce(
      (sum, candidate) => sum + candidate.votes,
      0
    );
    setTotalVotes(total);

    if (election.candidates && election.candidates.length > 0) {
      const leader = election.candidates.reduce((max, candidate) =>
        candidate.votes > max.votes ? candidate : max
      );
      setCurrentLeader(leader);
    }
  }, [election]);

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(2);
  };

  return (
    <div className="ElectionDetails">
      <h1>{election.title}</h1>
      <div className="election-info">
        <p>
          <span>Type of Election:</span> {election.electionType}
        </p>
        <p>
          <span>Start Date:</span>{" "}
          {new Date(election.startDate).toLocaleDateString()}
        </p>
        <p>
          <span>End Date:</span>{" "}
          {new Date(election.endDate).toLocaleDateString()}
        </p>
        <p>
          <span>City:</span> {election.city}
        </p>
        <p>
          <span>State:</span> {election.state}
        </p>
        <p>
          <span>About:</span> {election.description}
        </p>
      </div>

      <div className="election-poll">
        {isElectionEnded ? (
          currentLeader ? (
            <div className="winner-announcement">
              <h3>
                The Winner is: {currentLeader.user.firstName}{" "}
                {currentLeader.user.lastName}
              </h3>
              <p>Votes: {calculatePercentage(currentLeader.votes)}%</p>
            </div>
          ) : (
            <p>No winner could be determined.</p>
          )
        ) : (
          currentLeader && (
            <div className="current-leader">
              <h3>
                Currently Leading: {currentLeader.user.firstName}{" "}
                {currentLeader.user.lastName}
              </h3>
              <p>Votes: {calculatePercentage(currentLeader.votes)}%</p>
            </div>
          )
        )}
      </div>

      <div className="candidates-section">
        <h3>Candidates</h3>
        <div className="candidates-grid">
          {election.candidates && election.candidates.length > 0 ? (
            election.candidates.map((candidate, index) => (
              <div key={candidate._id} className="candidate-card">
                <Profile user={candidate.user} isCandidate />
                <p>Votes: {calculatePercentage(voteCounts[index])}%</p>
                {!isElectionEnded && (
                  <button
                    onClick={() => handleVote(candidate._id, index)}
                    disabled={voteCounts.includes(candidate._id)}
                  >
                    Vote for {candidate.user.firstName}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No candidates to display.</p>
          )}
        </div>
      </div>

      {voteStatus && (
        <div
          className={`VoteStatusMessage ${
            voteStatus.includes("success") ? "success" : "error"
          }`}
        >
          {voteStatus}
        </div>
      )}
    </div>
  );
};

export default ElectionDetails;

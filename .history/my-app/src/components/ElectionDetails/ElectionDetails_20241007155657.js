import React, { useState, useEffect } from "react";
import Profile from "../Profile/Profile";
import "./ElectionDetails.css";
import { useAuth } from "../AuthContext/AuthContext"; // Import useAuth for vote handling

const ElectionDetails = ({ election }) => {
  const [currentLeader, setCurrentLeader] = useState(null);
  const [isElectionEnded, setIsElectionEnded] = useState(false);
  const { postElectionVote } = useAuth(); // use the voting function from AuthContext

  useEffect(() => {
    const now = new Date();
    const endDate = new Date(election.endDate);
    setIsElectionEnded(now > endDate);

    if (election.candidates && election.candidates.length > 0) {
      const leader = election.candidates.reduce((max, candidate) =>
        candidate.votes > (max.votes || 0) ? candidate : max
      );
      setCurrentLeader(leader);
    }
  }, [election]);

  const handleVote = async (candidateId) => {
    try {
      const response = await postElectionVote(candidateId);
      alert(response.message);
      // You can refresh election data here to update the vote count in real-time
    } catch (error) {
      console.error("Error voting for candidate:", error);
    }
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
              <p>Votes: {currentLeader.votes}</p>
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
              <p>Votes: {currentLeader.votes}</p>
            </div>
          )
        )}
      </div>

      <div className="candidates-section">
        <h3>Candidates</h3>
        <div className="candidates-grid">
          {election.candidates && election.candidates.length > 0 ? (
            election.candidates.map((candidate) => (
              <div key={candidate._id} className="candidate-card">
                <Profile user={candidate.user} isCandidate />
                <p>Votes: {candidate.votes}</p>
                {!isElectionEnded && (
                  <button onClick={() => handleVote(candidate._id)}>
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
    </div>
  );
};

export default ElectionDetails;

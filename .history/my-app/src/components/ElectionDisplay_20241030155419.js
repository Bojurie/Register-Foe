import React from "react";

const ElectionDisplay = ({ election }) => {
  const { title, candidates, leadingCandidate } = election;

  return (
    <div>
      <h2>{title}</h2>
      <p>
        Leading Candidate: {leadingCandidate?.firstName}{" "}
        {leadingCandidate?.lastName}
      </p>
      <p>Vote Count: {leadingCandidate?.voteCount}</p>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate._id}>
            {candidate.firstName} {candidate.lastName} - {candidate.voteCount}{" "}
            votes ({candidate.votePercentage}%)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectionDisplay;

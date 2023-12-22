import React from "react";
import CandidateProfileComponent from "../CandidateProfileComponent/CandidateProfileComponent";

const CandidateList = ({ candidates }) => {
  // Check if candidates is undefined or empty
  if (!candidates || candidates.length === 0) {
    return <div className="CandidateList">No candidates available.</div>;
  }

  return (
    <div className="CandidateList">
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <CandidateProfileComponent
              name={candidate.name}
              city={candidate.city}
              votingParty={candidate.votingParty}
              age={candidate.age}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList;

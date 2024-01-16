import React from "react";
import CandidateProfileComponent from "../CandidateProfileComponent/CandidateProfileComponent";

const CandidateList = ({ candidates }) => {
  if (!candidates || candidates.length === 0) {
    return <div>No candidates available.</div>;
  }

  return (
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
  );
};

export default CandidateList;

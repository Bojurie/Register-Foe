import React from "react";
import CandidateProfileComponent from "../CandidateProfileComponent/CandidateProfileComponent";

const CandidateList = ({ candidates }) => {
  return (
    <div className="CandidateList">
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {/* Render the CandidateProfileComponent for each candidate */}
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

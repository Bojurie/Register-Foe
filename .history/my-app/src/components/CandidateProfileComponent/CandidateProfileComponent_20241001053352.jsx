import React from "react";

const CandidateProfile = ({ name, city, votingParty, age }) => {
  const handleCandidateClick = () => {
    console.log("Candidate clicked:", { name, city, votingParty, age });
 };

  return (
    <div
      className="CandidateProfileComponent"
      onClick={handleCandidateClick}
      style={{ cursor: "pointer" }}
    >
      <p>Name: {name}</p>
      <p>City: {city}</p>
      <p>Voting Party: {votingParty}</p>
      <p>Age: {age}</p>
    </div>
  );
};

export default CandidateProfile;

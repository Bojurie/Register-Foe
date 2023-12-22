import React from "react";

const CandidateProfileComponent = ({ name, city, votingParty, age }) => {
  const handleCandidateClick = () => {
    console.log("Candidate clicked:", { name, city, votingParty, age });
    // You can navigate to a detailed candidate view or show a modal, etc.
    // For simplicity, we'll just log the click for now
    //
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

export default CandidateProfileComponent;

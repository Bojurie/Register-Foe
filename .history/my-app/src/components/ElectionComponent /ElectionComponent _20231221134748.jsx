import React, { useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import { useAuth } from "../AuthContext/AuthContext";
import React, { useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionComponent = ({ election }) => {
  const { saveElection, isElectionSaved } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  if (!election) {
    return <div>Loading...</div>;
  }

  const handleSaveClick = () => {
    const electionData = {
      electionName: election.electionName || "Election",
      electionDate: election.date,
      constituency: `${election.city}, ${election.state}`,
      candidates: election.candidates,
    };
    saveElection(electionData);
  };


  return (
    <div className="ElectionComponent">
      <p>Date: {election.date}</p>
      <p>City: {election.city}</p>
      <p>State: {election.state}</p>
      <CandidateList candidates={election.candidates} />
      {!isSaved && <button onClick={handleSaveClick}>Save</button>}
      {isSaved && <p>Saved!</p>}
    </div>
  );
};

export default ElectionComponent;

import React, { useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionComponent = ({election, date, city, state, candidates }) => {
    const { saveElection, isElectionSaved } = useAuth();

  const [isSaved, setIsSaved] = useState(false);

const handleSaveClick = () => {
    const electionData = {
      electionName: "Your Election Name",
      electionDate: date,
      constituency: `${city}, ${state}`,
      candidates,
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

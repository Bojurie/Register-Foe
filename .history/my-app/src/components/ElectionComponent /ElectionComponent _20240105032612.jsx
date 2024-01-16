import React from "react";
import ElectionDetails from "../ElectionItem/ElectionItem";

const ElectionComponent = ({ election }) => {
  return (
    <div className="ElectionComponent">
      <h2>{election.electionName || "Election Name Not Available"}</h2>
      <p>Type: {election.electionType || "Type Not Available"}</p>
      <p>
        Date: {new Date(election.electionStartDate).toLocaleDateString()} to
        {new Date(election.electionEndDate).toLocaleDateString()}
      </p>
      <p>Description: {election.electionDesc || "Not available"}</p>
      <ElectionDetails election={election} />
    </div>
  );
};

export default ElectionComponent;

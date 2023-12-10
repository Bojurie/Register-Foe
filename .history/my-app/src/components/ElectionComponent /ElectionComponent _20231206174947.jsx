import React from "react";
import CandidateList from "../CandidateList ";

const ElectionComponent = ({ date, city, state, candidates }) => {
  return (
    <div className="ElectionComponent">
      <p>Date: {date}</p>
      <p>City: {city}</p>
      <p>State: {state}</p>
      <CandidateList candidates={candidates} />
    </div>
  );
};

export default ElectionComponent;

// App.js
import React from "react";
import ElectionDisplay from "./ElectionDisplay";

const ElectionDisplayFetcher = () => {
  return (
    <div className="App">
      <ElectionDisplay
        electionName="Presidential Election 2024"
        leadingCandidate="John Doe"
        votePercentage={52.5}
      />
    </div>
  );
};

export default ElectionDisplayFetcher;

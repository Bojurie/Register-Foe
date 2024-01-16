import React, { useState } from "react";

import UserProfile from "../Profile/userProfile";

const ElectionDetails = ({ election }) => {
  const users = election.candidates;

  return (
    <div className="ElectionDetails">
      <h1>Election Title: {election.electionTitle}</h1>
      <p>Type of Election: {election.electionType}</p>
      <p>
        Start Date: {new Date(election.electionStartDate).toLocaleDateString()}
      </p>
      <p>End Date: {new Date(election.electionEndDate).toLocaleDateString()}</p>
      <p>City: {election.electionCity}</p>
      <p>State: {election.electionState}</p>
      <p>Description: {election.electionDesc}</p>
      <h2>Candidates:</h2>
      <UserProfile users={users || []} />
    </div>
  );
};

export default ElectionDetails;
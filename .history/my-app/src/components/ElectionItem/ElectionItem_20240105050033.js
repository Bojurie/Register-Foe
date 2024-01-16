import React, { useState } from "react";

import UserProfile from "../Profile/userProfile";

const ElectionDetails = ({ election }) => {
  const users = election.candidates;

  return (
    <div className="ElectionDetails">
      <h1>Election Title: {election.title}</h1>
      <p>Type of Election: {election.electionType}</p>
      <p>Start Date: {new Date(election.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(election.endDate).toLocaleDateString()}</p>
      <p>City: {election.city}</p>
      <p>State: {election.state}</p>
      <p>Description: {election.electionDesc}</p>
      <h2>Candidates:</h2>
      <UserProfile users={users || []} />
    </div>
  );
};

export default ElectionDetails;
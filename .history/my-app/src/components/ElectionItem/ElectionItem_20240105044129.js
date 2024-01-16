import React from "react";

import UserProfile from "../Profile/userProfile";


const ElectionDetails = ({election}) => {


  
  return (
    <div className="ElectionDetails">
      <h1>{election.title}</h1>
      <p>{election.electionType}</p>
      <p>Date: {election.startDate}</p>
      <p>Date: {election.endDate}</p>
      <p>City: {election.city}</p>
      <p>State: {election.state}</p>
      <p>Description: {election.electionDesc}</p>
      <h2>Candidates:{election.onModel}</h2>
      <UserProfile candidates={candidates || []} />
    </div>
  );
};

export default ElectionDetails;
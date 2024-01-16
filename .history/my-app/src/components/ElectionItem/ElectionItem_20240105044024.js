import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserProfile from "../Profile/userProfile";
import { useAuth } from "../AuthContext/AuthContext";


const ElectionDetails = ({election}) => {
  const { user, getElectionById } = useAuth();
  const [election, setElection] = useState(null);
  const { id } = useParams();

  
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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserProfile from "../Profile/userProfile";
import { useAuth } from "../AuthContext/AuthContext";


const ElectionDetails = () => {
  const { user, getElectionById } = useAuth();
  const [election, setElection] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        // Pass the id to getElectionById
        const response = await getElectionById(id);
        setElection(response.data);
      } catch (error) {
        console.error("Error fetching election details:", error);
      }
    };

    if (id) {
      fetchElectionData();
    }
  }, [id, getElectionById]); // Add getElectionById as a dependency

  if (!election) {
    return <p>Loading election details...</p>;
  }

  const { electionName, electionDesc, date, city, state, candidates } =
    election;

  return (
    <div className="ElectionDetails">
      <h1>{election.electionName}</h1>
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
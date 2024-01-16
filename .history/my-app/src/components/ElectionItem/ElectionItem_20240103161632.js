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
      <h1>{electionName}</h1>
      <p>Date: {date}</p>
      <p>City: {city}</p>
      <p>State: {state}</p>
      <p>Description: {electionDesc}</p>
      <h2>Candidates:</h2>
      <UserProfile candidates={candidates || []} />
    </div>
  );
};

export default ElectionDetails;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandidateList from "../CandidateList/CandidateList";

const ElectionDetails = () => {
  const [election, setElection] = useState(null);
  const { id } = useParams(); // Get the election ID from the URL parameters

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const response = await axios.get(`/election/upcoming-elections/${id}`);
        setElection(response.data);
      } catch (error) {
        console.error("Error fetching election details:", error);
      }
    };

    fetchElectionData();
  }, [id]);

  if (!election) {
    return <p>Loading election details...</p>;
  }

  const { electionName, electDesc, date, city, state, candidates } = election;

  return (
    <div className="ElectionDetails">
      <h1>{electionName}</h1>
      <p>Date: {date}</p>
      <p>City: {city}</p>
      <p>State: {state}</p>
      <p>Description: {electDesc}</p>
      <h2>Candidates:</h2>
      <CandidateList candidates={candidates} />
    </div>
  );
};

export default ElectionDetails;

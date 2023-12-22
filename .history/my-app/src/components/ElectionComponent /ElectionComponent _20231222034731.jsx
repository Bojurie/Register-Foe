import React, { useEffect, useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";
const ElectionComponent = ({ electionId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [election, setElection] = useState(null);
  const { saveElection } = useAuth();
  const navigate = useNavigate()
const BASE_URL = "http:://localhost:3001/"
  useEffect(() => {
    axios
      .get(`/election/upcoming-elections/${electionId}`)
      .then((response) => {
        console.log("Election data:", response.data);
        setElection(response.data);
        console.log({ saveElection }); // Log to see if saveElection is a function
      })
      .catch((error) => console.error("Error fetching election:", error));
  }, [electionId]);

  if (!election) {
    return <p>Loading...</p>;
  }

  const { electionName, electDesc, date, city, state, candidates } = election; // Destructure for easier access

  const handleSaveClick = async () => {
    try {
      const electionData = {
        electionName,
        electionDate: date,
        constituency: `${city}, ${state}`,
        electDesc,
        candidates,
      };
      await saveElection(electionData);
      setIsSaved(true);
    } catch (error) {
      console.error("Error in saving election:", error);
    }
  };
 const goToElectionDetails = () => {
   navigate(`${BASE_URL}elections/${electionId}/details`); // Navigate to the election details page
 };
s
  return (
    <div className="ElectionComponent">
      <div
        className="Elections"
        onClick={goToElectionDetails}
        style={{ cursor: "pointer" }}
      >
        <h2>{electionName}</h2>
        <p>Date: {date || "Not available"}</p>
        <p>City: {city || "Not available"}</p>
        <p>State: {state || "Not available"}</p>
        <p>State: {electDesc || "Not available"}</p>
        <CandidateList candidates={candidates || []} />
      </div>
      {!isSaved ? (
        <button onClick={handleSaveClick}>Save</button>
      ) : (
        <p>Saved!</p>
      )}
    </div>
  );
};

export default ElectionComponent;

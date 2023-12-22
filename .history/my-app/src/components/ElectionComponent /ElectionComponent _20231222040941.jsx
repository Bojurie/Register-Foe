import React, { useEffect, useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";


const ElectionComponent = ({ electionId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [election, setElection] = useState(null);
  const { saveElection } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/election/upcoming-elections/${electionId}`)
      .then((response) => {
        console.log("Election data:", response.data);
        setElection(response.data);
      })
      .catch((error) => console.error("Error fetching election:", error));
  }, [electionId]);

  if (!election) {
    return <p>Loading...</p>;
  }

  const { electionName, electionDesc, electionDate, city, state, candidates } =
    election;


  const handleSaveClick = async () => {
    try {
      const electionData = {
        electionName,
        electionDate,
        constituency: `${city}, ${state}`,
        electionDesc,
        candidates
      };
      await saveElection(electionData);
      setIsSaved(true);
   } catch (error) {
      console.error("Error in saving election:", error);
    }
  };


  const goToElectionDetails = () => {
    navigate(`/elections/${electionId}/details`); // Use relative path for navigation
  };

  return (
    <div className="ElectionComponent">
      <div
        className="Elections"
        onClick={goToElectionDetails}
        style={{ cursor: "pointer" }}
      >
        <h2>{electionName}</h2>
        <p>Date: {election || "Not available"}</p>
        <p>City: {election.city || "Not available"}</p>
        <p>State: {election.state || "Not available"}</p>
        <p>Description: {election || "Not available"}</p>
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
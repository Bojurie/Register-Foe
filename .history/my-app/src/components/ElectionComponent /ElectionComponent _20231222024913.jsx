import React, { useEffect, useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "axios";

const ElectionComponent = ({ electionId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [election, setElection] = useState(null);
  const { saveElection, isElectionSaved } = useAuth();
  useEffect(() => {
    axios
      .get(`/election/upcoming-elections/${electionId}`)
      .then((response) => setElection(response.data))
      .catch((error) => console.error("Error fetching election:", error));
  }, [electionId]);


  if (!election) {
    return <p>Loading...</p>;
  }
  const handleSaveClick = async () => {
    try {
      const electionData = {
        electionName: election.electionName,
        electionDate: election.date,
        constituency: `${election.city}, ${election.state}`,
        candidates: election.candidates,
      };
      await saveElection(electionData);
      setIsSaved(true); // Update this state on successful save
    } catch (error) {
      console.error("Error in saving election:", error);
    }
  };

  return (
    <div className="ElectionComponent">
      <p>Date: {election.date}</p>
      <p>City: {election.city}</p>
      <p>State: {election.state}</p>
      <CandidateList candidates={election.candidates} />
      {!isSaved && <button onClick={handleSaveClick}>Save</button>}
      {isSaved && <p>Saved!</p>}
    </div>
  );
};

export default ElectionComponent;

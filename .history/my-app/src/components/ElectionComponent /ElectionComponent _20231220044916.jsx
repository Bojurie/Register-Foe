import React, { useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import axios from "axios";

const ElectionComponent = ({ date, city, state, candidates }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = () => {
    const electionData = {
      date,
      city,
      state,
      candidates,
    };

    // Make an API request to save the election
    axios
      .post("/api/save-election", {
        userId: "user_id_here", // Replace with the actual user ID
        electionData,
      })
      .then(() => {
        setIsSaved(true);
      })
      .catch((error) => {
        console.error("Error saving election:", error);
      });
  };

  return (
    <div className="ElectionComponent">
      <p>Date: {date}</p>
      <p>City: {city}</p>
      <p>State: {state}</p>
      <CandidateList candidates={candidates} />
      {!isSaved && <button onClick={handleSaveClick}>Save</button>}
      {isSaved && <p>Saved!</p>}
    </div>
  );
};

export default ElectionComponent;

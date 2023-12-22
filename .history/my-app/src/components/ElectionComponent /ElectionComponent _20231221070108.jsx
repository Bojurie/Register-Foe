import React, { useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import axios from "axios";

const jwtToken = process.env.JWT_SECRET;

const ElectionComponent = ({ date, city, state, candidates }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = () => {
    const electionData = {
      date,
      city,
      state,
      candidates,
    };

axios
  .post(
    "/auth/election/save-election",
    {
      electionData,
    },
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  )
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

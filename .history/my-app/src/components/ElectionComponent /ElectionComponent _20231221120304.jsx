import React, { useState , useEffect} from "react";
import CandidateList from "../CandidateList/CandidateList";
import axios from "axios";
import {
  getStoredToken,
  setStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const ElectionComponent = ({ date, city, state, candidates }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [jwtToken, setJwtToken] = useState(getStoredToken() || "");
// const [jwtToken, setJwtToken] = useState(getStoredToken() || "");

useEffect(() => {
  const token = getStoredToken();
  if (token) {
    setJwtToken(token);
  }
}, []);
useEffect(() => {
  console.log("Token from local storage:", jwtToken);
  setJwtToken(getStoredToken() || "");
}, []);
  useEffect(() => {
    setJwtToken(getStoredToken() || "");
  }, []); // Initialize the token when the component mounts

  const handleSaveClick = () => {
    const electionData = {
      electionName: "Your Election Name", // Replace with actual election name
      electionDate: date,
      constituency: `${city}, ${state}`,
      candidates,
    };

    axios
      .post(
        "/auth/savedElection/save-election",
        { electionData },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .then((response) => {
        // ... existing code ...
      })
      .catch((error) => {
        console.error("Error saving election:", error.response);
        // You can add more specific error handling here based on error.response
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

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

  useEffect(() => {
    setJwtToken(getStoredToken() || "");
  }, []);

  const refreshAccessToken = async () => {
    try {
      // Replace '/path-to-refresh-token-endpoint' with your actual refresh token endpoint
      const response = await axios.post("/auth/savedElections/token", {
        refreshToken: "yourRefreshToken", // Replace with your actual refresh token
      });
      const { accessToken } = response.data;
      setJwtToken(accessToken);
      setStoredToken(accessToken); // Update the token in local storage
      return accessToken;
    } catch (error) {
      // Redirect to login or handle the error
      console.error("Error refreshing token:", error);
      // Redirect to login page or display a login modal
    }
  };

  const handleSaveClick = async () => {
    const electionData = {
      electionName: "Your Election Name", // Replace with actual election name
      electionDate: date,
      constituency: `${city}, ${state}`,
      candidates,
    };

    try {
      await axios.post(
        "/auth/savedElection/save-election",
        { electionData },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setIsSaved(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry saving the election
          handleSaveClick();
        }
      } else {
        console.error("Error saving election:", error.response);
      }
    }
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

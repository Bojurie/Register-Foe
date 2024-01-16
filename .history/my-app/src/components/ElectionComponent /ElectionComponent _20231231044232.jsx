import React, { useEffect, useState } from "react";
import CandidateList from "../CandidateList/CandidateList";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";
import Profile from "../Profile/Profile";

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

  const {
    electionName,
    electionType,
    electionStartDate,
    electionEndDate,
    electionDesc,
    createdBy,
    companyCode,
    candidates,
  } = election;

  const handleSaveClick = async () => {
    try {
      const electionData = {
        electionName,
        electionType,
        electionStartDate,
        electionEndDate,
        electionDesc,
        createdBy,
        companyCode,
        candidates,
      };
      await saveElection(electionData);
      setIsSaved(true);
    } catch (error) {
      console.error("Error in saving election:", error);
    }
  };

  const goToElectionDetails = () => {
    navigate(`/elections/${electionId}/details`);
  };

  return (
    <div className="ElectionComponent">
      <div
        className="Elections"
        onClick={goToElectionDetails}
        style={{ cursor: "pointer" }}
      >
        <h2>{electionName}</h2>
        <p>Type: {electionType}</p>
        <p>
          Date:{" "}
          {electionStartDate
            ? new Date(electionStartDate).toLocaleDateString()
            : "Not available"}{" "}
          to{" "}
          {electionEndDate
            ? new Date(electionEndDate).toLocaleDateString()
            : "Not available"}
        </p>
        <p>Description: {electionDesc || "Not available"}</p>
        <Profile candidates={candidates || []} />
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
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

  // Destructure properties from election object
const { electionName, electionDesc, electionDate, constituency, candidates } =
  election;

  const handleSaveClick = async () => {
    try {
      const electionData = {
        electionName,
        electionDate,
        constituency, // Assuming constituency is a string containing city and state
        electionDesc,
        candidates,
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
<p>
  Constituency:{" "}
  {constituency
    ? `${constituency.city}, ${constituency.state}`
    : "Not available"}
</p>;

  return (
    <div className="ElectionComponent">
      <div
        className="Elections"
        onClick={goToElectionDetails}
        style={{ cursor: "pointer" }}
      >
        <h2>{electionName}</h2>
        <p>Date: {electionDate || "Not available"}</p>
        <p>Constituency: {constituency || "Not available"}</p>
        <p>Description: {electionDesc || "Not available"}</p>
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
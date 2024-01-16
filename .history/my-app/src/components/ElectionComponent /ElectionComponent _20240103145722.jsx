import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import ElectionDetails from "../ElectionItem/ElectionItem";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionComponent = ({ electionId }) => {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();
  const {getElection} = useAuth()

  useEffect(() => {
    axios
      getElection(`/election/upcoming-elections/${electionId}`)
        .then((response) => {
          console.log("Election data:", response.data);
          setElection(response.data);
          setLoading(false); // Data loaded successfully
        })
        .catch((error) => {
          console.error("Error fetching election:", error);
          setError(error); // Set error state
          setLoading(false); // Data loading failed
        });
  }, [electionId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>; // Display error message
  }

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
        <h2>{election.electionName}</h2>
        <p>Type: {election.electionType}</p>
        <p>
          Date:{" "}
          {election.electionStartDate
            ? new Date(election.electionStartDate).toLocaleDateString()
            : "Not available"}{" "}
          to{" "}
          {election.electionEndDate
            ? new Date(election.electionEndDate).toLocaleDateString()
            : "Not available"}
        </p>
        <p>Description: {election.electionDesc || "Not available"}</p>
      </div>
      <ElectionDetails election={election} />
    </div>
  );
};
export default ElectionComponent;

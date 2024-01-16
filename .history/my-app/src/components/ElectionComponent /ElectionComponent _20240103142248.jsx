import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import ElectionDetails from "../ElectionDetails/ElectionDetails";

const ElectionComponent = ({ electionId }) => {
  const [election, setElection] = useState(null);
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

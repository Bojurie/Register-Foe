import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ElectionDetails from "../ElectionItem/ElectionItem";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionComponent = ({ electionId }) => {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { getElectionById } = useAuth();

  useEffect(() => {
    if (!electionId) {
      console.error("No electionId provided");
      setError(new Error("No electionId provided"));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await getElectionById(electionId);
        console.log("Election data:", response.data);
        setElection(response.data);
      } catch (error) {
        console.error("Error fetching election:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [electionId, getElectionById]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message || "Error fetching election"}</p>;
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
        <h2>{election?.electionName || "Election Name Not Available"}</h2>
        <p>Type: {election?.electionType || "Type Not Available"}</p>
        <p>
          Date:{" "}
          {election?.electionStartDate
            ? new Date(election.electionStartDate).toLocaleDateString()
            : "Not available"}{" "}
          to{" "}
          {election?.electionEndDate
            ? new Date(election.electionEndDate).toLocaleDateString()
            : "Not available"}
        </p>
        <p>Description: {election?.electionDesc || "Not available"}</p>
      </div>
      <ElectionDetails election={election} />
    </div>
  );
};

export default ElectionComponent;
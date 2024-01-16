import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ElectionDetails from "../ElectionItem/ElectionItem";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionComponent = ({ electionId, companyCode }) => {
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { getElections } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!companyCode) {
        console.error("No companyCode provided");
        setError(new Error("No companyCode provided"));
        setLoading(false);
        return;
      }

      try {
        const response = await getElections(companyCode);
        const foundElection = response.find((e) => e._id === electionId);
        setElectionData(foundElection);
        if (!foundElection) {
          setError(new Error("Election not found"));
        }
      } catch (error) {
        console.error("Error fetching election:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyCode, getElections, electionId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message || "Error fetching election"}</p>;
  }

  const goToElectionDetails = () => {
    navigate(`/elections/${electionId}/details`, { state: { electionData } });
  };

  return (
    <div
      className="ElectionComponent"
      onClick={goToElectionDetails}
      style={{ cursor: "pointer" }}
    >
      <h2>{electionData?.electionName || "Election Name Not Available"}</h2>
      <p>Type: {electionData?.electionType || "Type Not Available"}</p>
      <p>
        Date:{" "}
        {electionData?.electionStartDate
          ? new Date(electionData.electionStartDate).toLocaleDateString()
          : "Not available"}{" "}
        to
        {electionData?.electionEndDate
          ? new Date(electionData.electionEndDate).toLocaleDateString()
          : "Not available"}
      </p>
      <p>Description: {electionData?.electionDesc || "Not available"}</p>
      <ElectionDetails election={electionData} />
    </div>
  );
};

export default ElectionComponent;
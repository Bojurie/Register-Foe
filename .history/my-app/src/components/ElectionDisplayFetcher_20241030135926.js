import React, { useState, useEffect } from "react";
import ElectionDisplay from "./ElectionDisplay";
import { useAuth } from "./AuthContext/AuthContext";

const ElectionDisplayFetcher = ({ companyCode }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getElections, user } = useAuth();

useEffect(() => {
  const fetchElections = async () => {
    const elections = await getElections(companyCode);
    console.log("Response from getElections:", elections);

    if (elections.length === 0) {
      console.warn("No elections found to display.");
      setElections([]); // Update state as needed
    } else {
      setElections(elections); // Set fetched elections to state
    }
  };

  fetchElections();
}, [companyCode]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      {elections.length > 0 ? (
        elections.map((election) => {
          const { name, candidates } = election;
          const leadingCandidate = candidates?.[0]?.candidateId || {
            firstName: "No",
            lastName: "candidates",
          };
          const votePercentage = candidates?.[0]?.votePercentage || "0.00";

          return (
            <ElectionDisplay
              key={election._id}
              electionName={name}
              leadingCandidate={`${leadingCandidate.firstName} ${leadingCandidate.lastName}`}
              votePercentage={votePercentage}
            />
          );
        })
      ) : (
        <p>No election data available.</p>
      )}
    </div>
  );
};

export default ElectionDisplayFetcher;

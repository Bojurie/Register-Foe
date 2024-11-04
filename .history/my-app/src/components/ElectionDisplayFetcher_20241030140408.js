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
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching elections for company code:", user.companyCode);

        const response = await getElections(user.companyCode);
        console.log("Response from getElections:", response);

        if (response && response.length > 0) {
          setElections(response);
        } else {
          setError("No upcoming elections found for this company.");
        }
      } catch (err) {
        console.error("Error fetching elections:", err.message);
        setError("An error occurred while fetching election data.");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [companyCode, getElections, user.companyCode]);

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

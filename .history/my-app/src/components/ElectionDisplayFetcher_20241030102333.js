// ElectionDisplayFetcher.js
import React, { useState, useEffect } from "react";
import ElectionDisplay from "./ElectionDisplay";
import axios from "axios";

const ElectionDisplayFetcher = ({ companyCode }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/elections/${companyCode}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const { elections } = response.data;

        if (elections.length) {
          setElections(elections);
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
  }, [companyCode]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Assuming we only want to show one election at a time in ElectionDisplay
  const { name, candidates } = elections[0] || {};
  const leadingCandidate = candidates?.[0]?.candidateId || "No candidates";
  const votePercentage = candidates?.[0]?.votePercentage || "0.00";

  return (
    <div className="App">
      {name && leadingCandidate ? (
        <ElectionDisplay
          electionName={name}
          leadingCandidate={`${leadingCandidate.firstName} ${leadingCandidate.lastName}`}
          votePercentage={votePercentage}
        />
      ) : (
        <p>No election data available.</p>
      )}
    </div>
  );
};

export default ElectionDisplayFetcher;

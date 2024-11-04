import React, { useState, useEffect, useCallback } from "react";
import ElectionDisplay from "./ElectionDisplay";
import { useAuth } from "./AuthContext/AuthContext";

const ElectionDisplayFetcher = ({ companyCode }) => {
  const [elections, setElections] = useState([]);
  const [currentElectionIndex, setCurrentElectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getElections, user } = useAuth();

  const fetchElections = useCallback(async () => {
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
  }, [getElections, user.companyCode]);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentElectionIndex(
        (prevIndex) => (prevIndex + 1) % elections.length
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [elections]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (elections.length === 0) {
    return <p>No election data available.</p>;
  }

  const currentElection = elections[currentElectionIndex];
  const leadingCandidate = currentElection.candidates?.[0]?.candidateId || {
    firstName: "No",
    lastName: "candidates",
  };
  const votePercentage =
    currentElection.candidates?.[0]?.votePercentage || "0.00";

  return (
    <ElectionDisplay
      electionName={currentElection.title}
      leadingCandidate={`${leadingCandidate.firstName} ${leadingCandidate.lastName}`}
      votePercentage={votePercentage}
    />
  );
};

export default ElectionDisplayFetcher;

// ElectionDisplayFetcher.js
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

      if (response && response.elections.length > 0) {
        setElections(response.elections);
      } else {
        setError(
          response.message || "No upcoming elections found for this company."
        );
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

  // Sort candidates by vote percentage and select the leading candidate, checking if candidates exist
  const leadingCandidateData = currentElection.candidates?.length
    ? currentElection.candidates.sort(
        (a, b) => b.votePercentage - a.votePercentage
      )[0]
    : {
        candidateId: { firstName: "No", lastName: "candidates" },
        votePercentage: "0.00",
      };

  // Ensure we handle cases where candidateId may be undefined
  const leadingCandidate = leadingCandidateData.candidateId
    ? `${leadingCandidateData.candidateId.firstName} ${leadingCandidateData.candidateId.lastName}`
    : "No candidates";

  const votePercentage = leadingCandidateData.votePercentage || "0.00";

  return (
    <ElectionDisplay
      electionName={currentElection.title}
      leadingCandidate={leadingCandidate}
      votePercentage={votePercentage}
    />
  );
};

export default ElectionDisplayFetcher;

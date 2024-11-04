import React, { useState, useEffect, useCallback } from "react";
import ElectionDisplay from "./ElectionDisplay";
import { useAuth } from "./AuthContext/AuthContext";

const ElectionDisplayFetcher = () => {
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

      if (response && response.elections && response.elections.length > 0) {
        setElections(response.elections);
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
    if (elections.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentElectionIndex(
          (prevIndex) => (prevIndex + 1) % elections.length
        );
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [elections]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (elections.length === 0) return <p>No election data available.</p>;

  const currentElection = elections[currentElectionIndex];

  // Safely extract leading candidate and vote percentage
  const leadingCandidate = currentElection.leadingCandidate || {
    candidateId: { firstName: "Unknown", lastName: "Candidate" },
    votes: 0,
  };
  const totalVotes = currentElection.totalVotes || 0;
  const leadingVoteCount = leadingCandidate.votes || 0;
  const votePercentage = totalVotes
    ? ((leadingVoteCount / totalVotes) * 100).toFixed(2)
    : "0.00";

  return (
    <ElectionDisplay
      electionName={currentElection.title || "No Title Available"}
      leadingCandidate={`${
        leadingCandidate.candidateId?.firstName || "Unknown First Name"
      } ${leadingCandidate.candidateId?.lastName || "Unknown Last Name"}`}
      votePercentage={votePercentage}
      startDate={new Date(currentElection.startDate)}
      endDate={new Date(currentElection.endDate)}
      location={`${currentElection.city || "Unknown City"}, ${
        currentElection.state || "Unknown State"
      }`}
    />
  );
};

export default ElectionDisplayFetcher;

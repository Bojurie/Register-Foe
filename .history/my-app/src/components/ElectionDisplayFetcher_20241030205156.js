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
      const response = await getElections(user.companyCode);

      if (response && response.elections && response.elections.length > 0) {
        setElections(response.elections);
      } else {
        setError("No upcoming elections found for this company.");
      }
    } catch (err) {
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

  if (loading) return <p>Loading elections...</p>;
  if (error) return <p>{error}</p>;

  if (elections.length === 0) return <p>No election data available.</p>;

  const currentElection = elections[currentElectionIndex];
  const candidates = currentElection.candidates || [];
  const leadingCandidateId = currentElection.leadingCandidate?._id;
  const leadingCandidateDetails = candidates.find(
    (candidate) => candidate._id.toString() === leadingCandidateId?.toString()
  ) || { firstName: "Unknown First Name", lastName: "Unknown Last Name" };

  const totalVotes = candidates.reduce(
    (acc, candidate) => acc + (candidate.votes || 0),
    0
  );
  const leadingVoteCount = currentElection.leadingCandidate?.votes || 0;
  const votePercentage = totalVotes
    ? ((leadingVoteCount / totalVotes) * 100).toFixed(2)
    : "0.00";

  return (
    <ElectionDisplay
      electionName={currentElection.title || "No Title Available"}
      leadingCandidate={`${leadingCandidateDetails.firstName} ${leadingCandidateDetails.lastName}`}
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

import React, { useState, useEffect } from "react";
import UserProfile from "../Profile/userProfile";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionDetails = ({ election }) => {
  const [userProfiles, setUserProfiles] = useState([]);
  const { fetchUserById } = useAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await Promise.all(
        election.candidates.map((userId) => fetchUserById(userId))
      );
      setUserProfiles(profiles.filter((profile) => profile != null));
    };

    if (election.candidates && election.candidates.length > 0) {
      fetchProfiles();
    }
  }, [election.candidates, fetchUserById]); // Depend on fetchUserById

  return (
    <div className="ElectionDetails">
      <h1>Election Title: {election.title}</h1>
      <p>Type of Election: {election.electionType}</p>
      <p>Start Date: {new Date(election.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(election.endDate).toLocaleDateString()}</p>
      <p>City: {election.city}</p>
      <p>State: {election.state}</p>
      <p>Description: {election.description}</p>
      <h2>Candidates:</h2>
      <UserProfile users={userProfiles} />
    </div>
  );
};

export default ElectionDetails;

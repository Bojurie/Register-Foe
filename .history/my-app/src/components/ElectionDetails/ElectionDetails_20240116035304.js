import React, { useState, useEffect } from "react";
import UserProfile from "../Profile/userProfile";
import { useAuth } from "../AuthContext/AuthContext";
import Profile from "../Profile/Profile";

const ElectionDetails = ({ election }) => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [saved, setSaved] = useState(false); // State variable for saved status
  const [message, setMessage] = useState(""); // State variable for message
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
  }, [election.candidates, fetchUserById]);

  // Function to handle saving the election
  const handleSaveElection = () => {
    // Implement your logic to save the election here
    // For example, make an API request to save the election
    // Once the election is saved, update the state variables
    setSaved(true);
    setMessage("Election has been saved!");

    // You can also add animations or delays here if needed
  };

  return (
    <div className="ElectionDetails">
      <h1>Election Title: {election.title}</h1>
      <p>Type of Election: {election.electionType}</p>
      <p>Start Date: {new Date(election.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(election.endDate).toLocaleDateString()}</p>
      <p>City: {election.city}</p>
      <p>State: {election.state}</p>
      <p>Description: {election.description}</p>
      <UserProfile users={userProfiles} />

      {/* Button to save the election */}
      <button onClick={handleSaveElection}>Save Election</button>

      {/* Display saved status and message */}
      {saved && <p className="saved-message">{message}</p>}
    </div>
  );
};

export default ElectionDetails;

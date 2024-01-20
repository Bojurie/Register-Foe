import React, { useState, useEffect } from "react";
import UserProfile from "../Profile/userProfile";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionDetails = ({ election }) => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const { fetchUserById, handleSaveElection } = useAuth();

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

const initiateSaveElection = async () => {
  try {
    // Check if election.id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(election.id)) {
      setMessage("Invalid election ID");
      return;
    }

    const electionData = {
      electionId: election.id,
      companyCode: election.companyCode,
    };

    const response = await handleSaveElection(electionData);

    if (response.success) {
      setSaved(true);
      setMessage("Election has been saved successfully!");
    } else {
      setMessage("Failed to save election");
    }
  } catch (error) {
    setMessage(error.message || "An error occurred while saving the election");
  }
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
      <button onClick={initiateSaveElection}>Save Election</button>

      {/* Display saved status and message */}
      {message && (
        <p className={saved ? "saved-message success" : "saved-message error"}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ElectionDetails;

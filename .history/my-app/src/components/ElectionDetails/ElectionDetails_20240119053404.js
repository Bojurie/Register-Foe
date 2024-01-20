import React, { useState, useEffect } from "react";
import UserProfile from "../Profile/userProfile";
import { useAuth } from "../AuthContext/AuthContext";
import { motion } from "framer-motion"; 
import './ElectionDetails.css'
const ElectionDetails = ({ election }) => {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const { fetchUserById, handleSaveElection } = useAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profiles = await Promise.all(
          election.candidates.map((userId) => {
            const idString =
              typeof userId === "object" ? userId._id.toString() : userId;
            return fetchUserById(idString);
          })
        );
        setUserProfiles(profiles.filter((profile) => profile !== null));
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    if (election.candidates && election.candidates.length > 0) {
      fetchProfiles();
    }
  }, [election.candidates, fetchUserById]);

  const initiateSaveElection = async () => {
    try {
      const electionData = {
        electionId: election._id,
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
      setMessage(
        error.message || "An error occurred while saving the election"
      );
    }
  };

  return (
    <motion.div
      className="ElectionDetails"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>{election.title}</h1>
      <p>
        <span>Type of Election:</span> {election.electionType}
      </p>
      <div>
        <p>
          <span>Start Date:</span>{" "}
          {new Date(election.startDate).toLocaleDateString()}
        </p>
        <p>
          <span>End Date:</span>{" "}
          {new Date(election.endDate).toLocaleDateString()}
        </p>
      </div>
      <p>
        <span>City:</span> {election.city}
      </p>
      <p>
        <span>State:</span> {election.state}
      </p>
      <p>
        <span>About:</span> {election.description}
      </p>
      <UserProfile
        users={users}
        election={election}
        candidates={election.candidates}
      />

      <button onClick={initiateSaveElection}>Save Election</button>
      {message && (
        <p className={`saved-message ${saved ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </motion.div>
  );
};

export default ElectionDetails;
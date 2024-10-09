import React, { useState, useEffect } from "react";
import UserProfile from "../Profile/userProfile";
import { useAuth } from "../AuthContext/AuthContext";
import "./ElectionDetails.css";

const ElectionDetails = ({ election }) => {
  const { handleSaveElection, getCandidatesById } = useAuth();
  const [userProfiles, setUserProfiles] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCandidateProfiles = async () => {
      if (!election._id) {
        setError("Election ID not available.");
        return;
      }

      try {
        // Fetch all candidates for the election in a single call
        const profiles = await getCandidatesById(election._id);
        setUserProfiles(profiles);
        setError("");
      } catch (error) {
        console.error("Error fetching candidate profiles:", error);
        setError("Failed to fetch candidate profiles.");
      }
    };

    fetchCandidateProfiles();
  }, [election._id]);

  const initiateSaveElection = async () => {
    setIsSaving(true);

    try {
      const result = await handleSaveElection(election._id);
      if (result?.success) {
        setSaved(true);
        setError("");
      } else {
        throw new Error("Could not save the election.");
      }
    } catch (err) {
      setError("Failed to save the election.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ElectionDetails">
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

      <div>
        {userProfiles.length > 0 ? (
          <>
            <h3>Candidates</h3>
            {userProfiles.map((profile) => (
              <UserProfile key={profile._id} profile={profile} />
            ))}
          </>
        ) : (
          <p>No candidates to display.</p>
        )}
      </div>

      {!saved ? (
        <button onClick={initiateSaveElection} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Election"}
        </button>
      ) : (
        <p>Election saved successfully!</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ElectionDetails;

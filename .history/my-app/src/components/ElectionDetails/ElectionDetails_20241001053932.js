import React, { useState, useEffect } from "react";
import Profile from "../Profile/Profile";
import { useAuth } from "../AuthContext/AuthContext";
import "./ElectionDetails.css";

const ElectionDetails = ({ election }) => {
  const { handleSaveElection, getCandidatesById } = useAuth();
  const [userProfiles, setUserProfiles] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

  useEffect(() => {
    if (!election?._id) {
      setError("Election ID not available.");
      setIsLoadingProfiles(false);
      return;
    }

    const fetchCandidateProfiles = async () => {
      try {
        setIsLoadingProfiles(true);
        const profiles = await getCandidatesById(election._id);
        setUserProfiles(profiles?.length > 0 ? profiles : []);
        setError(
          profiles?.length === 0
            ? "No candidates available for this election."
            : ""
        );
      } catch (err) {
        console.error("Error fetching candidate profiles:", err);
        setError("Failed to fetch candidate profiles.");
      } finally {
        setIsLoadingProfiles(false);
      }
    };

    fetchCandidateProfiles();
  }, [election?._id, getCandidatesById]);

  const initiateSaveElection = async () => {
    setIsSaving(true);
    try {
      const result = await handleSaveElection(election._id);
      setSaved(result?.success);
      setError(result?.success ? "" : "Could not save the election.");
    } catch {
      setError("Failed to save the election.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderCandidateProfiles = () => {
    if (isLoadingProfiles) return <p>Loading candidate profiles...</p>;
    if (userProfiles.length > 0) {
      return userProfiles.map((profile) => (
        <Profile key={profile._id} user={profile} />
      ));
    }
    return <p>{error || "No candidates to display."}</p>;
  };

  return (
    <div className="ElectionDetails">
      <h1>{election?.title || "Election Details"}</h1>
      <p>
        <span>Type of Election:</span> {election?.electionType || "N/A"}
      </p>
      <div>
        <p>
          <span>Start Date:</span>{" "}
          {election?.startDate
            ? new Date(election.startDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <span>End Date:</span>{" "}
          {election?.endDate
            ? new Date(election.endDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
      <p>
        <span>City:</span> {election?.city || "N/A"}
      </p>
      <p>
        <span>State:</span> {election?.state || "N/A"}
      </p>
      <p>
        <span>About:</span> {election?.description || "No description provided"}
      </p>
      <div>
        <h3>Candidates</h3>
        {renderCandidateProfiles()}
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

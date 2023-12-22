import React, { useEffect, useState } from "react";
import axios from "axios";
import './SavedElections.css'



const SavedElections = ({ userId }) => {
  const [savedElections, setSavedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/auth/savedElection/saved-elections/${userId}`)
      .then((response) => {
        setSavedElections(response.data.savedElections);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response
            ? err.response.data.message
            : "Failed to load saved elections"
        );
        setLoading(false);
      });
  }, [userId]);

  const handleDeleteSavedElection = (electionId) => {
    axios
      .delete(`/api/savedElection/saved-elections/${electionId}`)
      .then(() => {
        setSavedElections(savedElections.filter((e) => e._id !== electionId));
        // Optionally, display a success message
      })
      .catch((err) => {
        setError(
          err.response ? err.response.data.message : "Failed to delete election"
        );
        // Optionally, revert the optimistic update here
      });
  };

  if (loading) return <p>Loading saved elections...</p>;
  if (error) return <p>Error loading saved elections: {error}</p>;

  return (
    <div className="savedElections">
      <h2>Saved Elections</h2>
      <ul>
        {savedElections.map((savedElection) => (
          <li key={savedElection._id}>
            <p>Election Date: {savedElection.election.date}</p>
            <p>City: {savedElection.election.city}</p>
            <p>State: {savedElection.election.state}</p>
            <button
              onClick={() => handleDeleteSavedElection(savedElection._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedElections;

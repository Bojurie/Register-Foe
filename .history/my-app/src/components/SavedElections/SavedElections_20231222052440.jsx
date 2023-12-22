import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SavedElections.css";

const SavedElections = ({ userId }) => {
  const [savedElections, setSavedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:3000/";

  useEffect(() => {
    axios
      .get(`${BASE_URL}savedElection/saved-elections/${userId}`)
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
      .delete(`${BASE_URL}savedElection/saved-elections/${electionId}`)
      .then(() => {
        setSavedElections(savedElections.filter((e) => e._id !== electionId));
      })
      .catch((err) => {
        setError(
          err.response ? err.response.data.message : "Failed to delete election"
        );
      });
  };

  return (
    <div className="savedElections">
      <h2>Saved Elections</h2>
      {loading && <p>Loading saved elections...</p>}
      {error && <p>Error loading saved elections: {error}</p>}
      {savedElections.length > 0 ? (
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
      ) : (
        !loading && <p>No saved elections found.</p>
      )}
    </div>
  );
};

export default SavedElections;

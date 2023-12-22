import React, { useEffect, useState } from "react";
import axios from "axios";
import './SavedElections.css'
const SavedElections = ({ userId }) => {
  const [savedElections, setSavedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
axios
  .get(`/auth/elections/saved-elections/${userId}`)
  .then((response) => {
    const fetchedSavedElections = response.data.savedElections;
    setSavedElections(fetchedSavedElections);
    setLoading(false);
  })
  .catch((err) => {
    setError(err);
    setLoading(false);
  });
  }, [userId]);

  const handleDeleteSavedElection = (electionId) => {
    axios
      .delete(`/auth/elections/saved-elections/${electionId}`)
      .then(() => {
        setSavedElections(savedElections.filter((e) => e._id !== electionId));
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (loading) {
    return (
      <div className="savedElections">
        <h2>Saved Elections</h2>
        <p>Loading saved elections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="savedElections">
        <h2>Saved Elections</h2>
        <p>Error loading saved elections: {error.message}</p>
      </div>
    );
  }

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

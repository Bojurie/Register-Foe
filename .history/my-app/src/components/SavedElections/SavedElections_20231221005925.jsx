import React, { useEffect, useState } from "react";
import axios from "axios";
const SavedElections = ({ userId }) => {
  const [savedElections, setSavedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/saved-elections/user/${userId}`);
        const fetchedSavedElections = response.data.savedElections;
        setSavedElections(fetchedSavedElections);
      } catch (err) {
        setError(err.message || "Error loading saved elections.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <p>Loading saved elections...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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

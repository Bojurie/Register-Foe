import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavigation from "../DashboardNavigation/DashboardNavigation"; // Import the common navigation component

const SavedElections = ({ userId }) => {
  const [savedElections, setSavedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Make the API request to fetch saved elections for the user
    axios
      .get(`/api/saved-elections/user/${userId}`)
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
    // Make an API request to delete the saved election
    axios
      .delete(`/api/saved-elections/${electionId}`)
      .then(() => {
        // Remove the deleted election from the state
        setSavedElections(savedElections.filter((e) => e._id !== electionId));
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (loading) {
    return <p>Loading saved elections...</p>;
  }

  if (error) {
    return <p>Error loading saved elections: {error.message}</p>;
  }

  return (
    <div>
    <DashboardNavigation />
      <h2>Saved Elections</h2>
      <nav></nav>
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

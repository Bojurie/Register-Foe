import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import ElectionDetails from "../ElectionDetails/ElectionDetails";

const ElectionsWidget = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [error, setError] = useState("");
  const { getElection } = useAuth();

  useEffect(() => {
    const fetchUpcomingElections = async () => {
      try {
        const response = await getElection();
        if (response && response.data) {
          setUpcomingElections(response.data);
        } else {
          throw new Error("Invalid response from the server");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Error fetching upcoming elections";
        console.error("Error fetching upcoming elections:", errorMessage);
        setError(errorMessage);
      }
    };

    fetchUpcomingElections();
  }, [getElection]);

  return (
    <div className="ElectionsWidget">
      <h2>Upcoming Elections</h2>
      {error && <p className="error">{error}</p>}
      {upcomingElections.length > 0 ? (
        <ul>
          {upcomingElections.map((election) => (
            <ElectionDetails key={election._id} election={election} />
          ))}
        </ul>
      ) : (
        <p>No upcoming elections found.</p>
      )}
    </div>
  );
};

export default ElectionsWidget;
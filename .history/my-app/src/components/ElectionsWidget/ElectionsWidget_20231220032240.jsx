import React, { useState, useEffect } from "react";
import axios from "axios";
import ElectionItem from "../ElectionItem/ElectionItem";

const ElectionsWidget = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpcomingElections = async () => {
      try {
        const response = await axios.get("auth/election/upcoming-elections");
        setUpcomingElections(response.data);
      } catch (error) {
        console.error("Error fetching upcoming elections:", error.message);
        setError(error.message);
      }
    };

    fetchUpcomingElections();
  }, []);

  return (
    <div className="ElectionsWidget">
      <h2>Upcoming Elections</h2>
      {error ? (
        <p>Error fetching elections: {error}</p>
      ) : (
        <ul>
          {upcomingElections.map((election) => (
            <ElectionItem key={election.id} election={election} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ElectionsWidget;

// ElectionsWidget.jsx
import React, { useState, useEffect } from "react";
import ElectionItem from "../ElectionItem/ElectionItem";

const ElectionsWidget = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);

  useEffect(() => {
    // Assume you have a function to fetch upcoming elections
    // For simplicity, let's use a placeholder function
    const fetchUpcomingElections = async () => {
      const response = await fetch("http://localhost:3001/election");
      const data = await response.json();
      setUpcomingElections(data);
    };

    fetchUpcomingElections();
  }, []);

  return (
    <div className="ElectionsWidget">
      <h2>Upcoming Elections</h2>
      <ul>
        {upcomingElections.map((election) => (
          <ElectionItem key={election.id} election={election} />
        ))}
      </ul>
    </div>
  );
};

export default ElectionsWidget;

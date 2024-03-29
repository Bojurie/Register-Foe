import React, { useState, useEffect } from "react";
import ElectionItem from "../ElectionItem/ElectionItem";

const ElectionsWidget = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);

  useEffect(() => {
    // Assume you have a function to fetch upcoming elections
    // For simplicity, let's use a placeholder function
    const fetchUpcomingElections = async () => {
      try {
        const response = await fetch("election/upcoming-elections");
        const data = await response.json();
        setUpcomingElections(data);
      } catch (error) {
        console.error("Error fetching upcoming elections:", error.message);
      }
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

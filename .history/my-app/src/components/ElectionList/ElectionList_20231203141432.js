import React, { useState, useEffect } from "react";

const ElectionList = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    // Function to fetch upcoming elections (example, you may use a real API)
    const fetchElections = async () => {
      try {
        // Use your API endpoint or data source
        const response = await fetch(
          "https://api.example.com/upcoming-elections"
        );
        const data = await response.json();
        setElections(data);
      } catch (error) {
        console.error("Error fetching elections:", error);
      }
    };

    fetchElections();
  }, []);

  return (
    <div>
      <h2>Upcoming Elections</h2>
      <ul>
        {elections.map((election) => (
          <li key={election.id}>
            <strong>{election.state}</strong>: {election.candidate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectionList;

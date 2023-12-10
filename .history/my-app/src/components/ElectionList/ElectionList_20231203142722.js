import React, { useState, useEffect } from "react";

const ElectionList = () => {
  const [elections, setElections] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [filteredElections, setFilteredElections] = useState([]);

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
        setFilteredElections(data); // Initialize filtered elections with all elections
      } catch (error) {
        console.error("Error fetching elections:", error);
      }
    };

    fetchElections();
  }, []);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleFilter = () => {
    // Filter elections based on user input (state or zip code)
    const filtered = elections.filter(
      (election) =>
        election.state.toLowerCase().includes(userInput.toLowerCase()) ||
        election.zipCode.toString().includes(userInput)
    );
    setFilteredElections(filtered);
  };

  return (
    <div>
      <h2>Upcoming Elections</h2>
      <div>
        <label htmlFor="userInput">Enter State or Zip Code: </label>
        <input
          type="text"
          id="userInput"
          value={userInput}
          onChange={handleInputChange}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>
      <ul>
        {filteredElections.map((election) => (
          <li key={election.id}>
            <strong>State:</strong> {election.state}, <strong>Date:</strong>{" "}
            {election.date}, <strong>Type:</strong> {election.type},{" "}
            <strong>Candidate:</strong> {election.candidate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectionList;

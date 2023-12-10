import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css"; // Import your CSS file

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [userInput, setUserInput] = useState("");
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);

  useEffect(() => {
    // Fetch current time
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    // Fetch current location
    const locationOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const locationSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation(`Lat: ${latitude}, Long: ${longitude}`);
    };

    const locationError = (error) => {
      console.error("Error getting location:", error.message);
      setCurrentLocation("Location not available");
    };

    navigator.geolocation.getCurrentPosition(
      locationSuccess,
      locationError,
      locationOptions
    );

    // Cleanup intervals
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleFilter = () => {
    // Filter elections based on user input (replace with your API endpoint)
    const filtered = elections.filter(
      (election) =>
        election.state.toLowerCase().includes(userInput.toLowerCase()) ||
        election.city.toLowerCase().includes(userInput.toLowerCase()) ||
        election.zipcode.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredElections(filtered);
  };

  useEffect(() => {
    // Fetch upcoming elections from FEC API (replace with your API endpoint)
    const fetchElections = async () => {
      try {
        const response = await axios.get(
          "http://your-server-url/upcoming-elections"
        );
        setElections(response.data);
      } catch (error) {
        console.error("Error fetching elections:", error.response.data);
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <p>Current Time: {currentTime}</p>
      <p>Current Location: {currentLocation}</p>

      <div className="search-container">
        <label htmlFor="userInput">Enter State, City, or Zip Code:</label>
        <input
          type="text"
          id="userInput"
          value={userInput}
          onChange={handleInputChange}
        />
        <button onClick={handleFilter}>Search</button>
      </div>

      <ul>
        {filteredElections.length > 0 ? (
          filteredElections.map((election) => (
            <li key={election.id}>
              <strong>State:</strong> {election.state}, <strong>Date:</strong>{" "}
              {election.date}, <strong>Type:</strong> {election.type},{" "}
              <strong>Candidate:</strong> {election.candidate}
            </li>
          ))
        ) : (
          <p>No elections found.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;

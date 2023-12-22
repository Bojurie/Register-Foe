import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import "./SearchBar.css";
import { Link } from "react-router-dom"; // Import Link from React Router
import ElectionComponent from "../ElectionComponent /ElectionComponent ";

const SearchBar = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [filteredElections, setFilteredElections] = useState([]); // Store filtered elections

  useEffect(() => {
    setLoading(true);
    axios
      .get("election/upcoming-elections")
      .then((response) => {
        const elections = response.data;
        setUpcomingElections(elections);
        setFilteredElections(elections); // Initially, show all upcoming elections
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching upcoming elections:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = debounce((searchTerm) => {
    const filtered = upcomingElections.filter((election) =>
      election.electionName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredElections(filtered);
  }, 300); // Debounce for 300 ms

  useEffect(() => {
    if (userInput.trim()) {
      handleSearch(userInput);
    } else {
      setFilteredElections(upcomingElections);
    }
  }, [userInput, upcomingElections]);

  return (
    <div className="ElectionList">
      <label htmlFor="userInput">Search:</label>
      <input
        type="text"
        id="userInput"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {filteredElections.length === 0 && (
        <p>No results found for "{userInput}"</p>
      )}
      {filteredElections.map((election) => (
        <div key={election._id}>
          <Link to={`/elections/${election._id}`}>
            <h3>{election.electionName}</h3>
            <p>Election Date: {election.electionDate}</p>
            <p>Constituency: {election.constituency}</p>
          </Link>
          <ElectionComponent election={election} />
        </div>
      ))}
    </div>
  );
};

export default SearchBar;

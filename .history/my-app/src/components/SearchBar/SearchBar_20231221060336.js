import React, { useState , useEffect} from "react";
import axios from "axios";
import './SearchBar.css'





import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import ElectionDetail from "./ElectionDetail"; // Import the ElectionDetail component

const SearchBar = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get("/auth/election/demo/upcoming-elections")
      .then((response) => {
        const elections = response.data;
        setUpcomingElections(elections);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching upcoming elections:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    // Implement your search logic here
    // You can filter the elections based on userInput and update searchResults
    // For example:
    const filteredElections = upcomingElections.filter((election) =>
      election.electionName.toLowerCase().includes(userInput.toLowerCase())
    );

    setSearchResults(filteredElections);
  };

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
      {upcomingElections.map((election) => (
        <div key={election._id}>
          <Link to={`/elections/${election._id}`}>
            {" "}
            {/* Link to the election details page */}
            <h3>{election.electionName}</h3>
            <p>Election Date: {election.electionDate}</p>
            <p>Constituency: {election.constituency}</p>
          </Link>
          <ElectionDetail election={election} />{" "}
          {/* Render the ElectionDetail component */}
        </div>
      ))}
    </div>
  );
};

export default SearchBar;




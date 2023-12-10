import React, { useState } from "react";
import axios from "axios";
import ElectionList from "../ElectionList/ElectionList";

const SearchBar = () => {
  const [userInput, setUserInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      // Make an Axios GET request to your Express.js server
      const response = await axios.get("http://localhost:3001/election", {
        params: { query: userInput },
      });

      // Assuming the server responds with an array of election data
      const results = response.data;

      // Update the state with the search results
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="SearchBar">
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

      {/* Display search results */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {searchResults.length > 0 && <ElectionList elections={searchResults} />}
    </div>
  );
};

export default SearchBar;

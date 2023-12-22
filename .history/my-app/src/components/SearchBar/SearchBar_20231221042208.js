import React, { useState , useEffect} from "react";
import axios from "axios";
import ElectionList from "../../components/ElectionList /ElectionList";
import './SearchBar.css'


const SearchBar = () => {
  const [userInput, setUserInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const [upcomingElections, setUpcomingElections] = useState([]);


  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("http://localhost:3001/auth/election", {
        params: { query: userInput },
      });

     const results = response.data;

      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Make a GET request to fetch upcoming elections
    axios
      .get("/auth/election/demo/upcoming-elections")
      .then((response) => {
        const elections = response.data;
        setUpcomingElections(elections);
      })
      .catch((error) => {
        console.error("Error fetching upcoming elections:", error);
      });
  }, []);

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

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {searchResults.length > 0 && <ElectionList elections={searchResults} />}
      {/* {upcomingElections} */}
    </div>
  );
};

export default SearchBar;

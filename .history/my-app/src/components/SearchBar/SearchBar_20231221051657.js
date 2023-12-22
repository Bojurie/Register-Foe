import React, { useState , useEffect} from "react";
import axios from "axios";
import ElectionList from "../../components/ElectionList /ElectionList";
import './SearchBar.css'
import CandidateList from "../CandidateList/CandidateList";


// import CandidateList from "./CandidateList"; // Import your CandidateList component here

const SearchBar = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
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
      {error && <p>Error: {error.message}</p>}
      {searchResults.length > 0 && <ElectionList elections={searchResults} />}

      {/* Render upcoming elections */}
      {upcomingElections.map((election) => (
        <div key={election._id}>
          <h3>{election.electionName}</h3>
          <p>Election Date: {election.electionDate}</p>
          <p>Constituency: {election.constituency}</p>
          <div className="election-detail">
            <h4>decription</h4>
            <div>
              <p>description{election.constituency}</p>
            </div>
          </div>
          <CandidateList candidates={election.candidates} />
        </div>
      ))}
    </div>
  );
};

export default SearchBar;

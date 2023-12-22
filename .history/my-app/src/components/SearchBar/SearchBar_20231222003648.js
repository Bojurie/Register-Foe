import { useState, useEffect } from "react";
import axios from "axios";
import SearchInput from "../SearchInput/SearchInput";
import ElectionList from "../ElectionList /ElectionList";
import { debounce } from "lodash";


const SearchBar = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [filteredElections, setFilteredElections] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/election/upcoming-elections")
      .then((response) => {
        setUpcomingElections(response.data);
        setFilteredElections(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleSearch = debounce((searchTerm) => {
      const filtered = upcomingElections.filter((election) =>
        election.electionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredElections(filtered);
    }, 300);

    if (userInput.trim()) {
      handleSearch(userInput);
    } else {
      setFilteredElections(upcomingElections);
    }
  }, [userInput, upcomingElections]);

  return (
    <div className="ElectionList">
      <SearchInput onSearchChange={setUserInput} loading={loading} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {filteredElections.length === 0 && (
        <p>No results found for "{userInput}"</p>
      )}
      <ElectionList elections={filteredElections} />
    </div>
  );
};

export default SearchBar;

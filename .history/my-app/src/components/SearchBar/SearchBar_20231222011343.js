import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import SearchInput from "../SearchInput/SearchInput";
import ElectionList from "../ElectionList /ElectionList";
import { debounce } from "lodash";

const SearchBar = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/election/upcoming-elections")
      .then((response) => {
        setUpcomingElections(response.data);
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
      setUpcomingElections(filtered);
    }, 300);

    if (userInput.trim()) {
      handleSearch(userInput);
    } else {
      setUpcomingElections(upcomingElections);
    }
  }, [userInput, upcomingElections]);

  return (
    <div className="ElectionList">
      <SearchInput onSearchChange={setUserInput} loading={loading} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ElectionList elections={upcomingElections} />
    </div>
  );
};

export default SearchBar;
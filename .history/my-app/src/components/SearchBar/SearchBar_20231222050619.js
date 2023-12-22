import React, { useState, useEffect, useCallback} from "react";
import axios from "axios";
import SearchInput from "../SearchInput/SearchInput";
import { debounce } from "lodash";


const SearchBar = ({ onElectionsFetched }) => {
  const [userInput, setUserInput] = useState("");
  const [allElections, setAllElections] = useState([]);

  useEffect(() => {
    axios
      .get("election/upcoming-elections")
      .then((response) => {
        setAllElections(response.data);
        onElectionsFetched(response.data);
      })
      .catch((error) => console.error("Error fetching elections:", error));
  }, [onElectionsFetched]);

  const handleSearch = useCallback(
    debounce((searchTerm) => {
      const filtered = allElections.filter((election) =>
        election.electionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onElectionsFetched(filtered);
    }, 300),
    [allElections, onElectionsFetched]
  );

  useEffect(() => {
    handleSearch(userInput);
  }, [userInput, handleSearch]);

  return (
    <div>
      <SearchInput onSearchChange={setUserInput} />
    </div>
  );
};

export default SearchBar;
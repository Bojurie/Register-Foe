import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchInput from "../SearchInput/SearchInput";
import { debounce } from "lodash";

const SearchBar = ({ onElectionsFetched }) => {
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    axios
      .get("election/upcoming-elections")
      .then((response) => {
        const elections = response.data;
        onElectionsFetched(elections); // Call the callback with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching elections:", error);
        onElectionsFetched([]); // Pass empty array in case of error
      });
  }, [onElectionsFetched]);

  const handleSearch = debounce((searchTerm) => {
    onElectionsFetched(searchTerm); // Call the callback with the search term
  }, 300);

  useEffect(() => {
    if (userInput.trim()) {
      handleSearch(userInput);
    }
  }, [userInput]);

  return (
    <div>
      <SearchInput onSearchChange={setUserInput} />
    </div>
  );
};
export default SearchBar;
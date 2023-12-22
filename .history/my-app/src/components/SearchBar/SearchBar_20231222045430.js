import React, { useState, useEffect, useCallback} from "react";
import axios from "axios";
import SearchInput from "../SearchInput/SearchInput";
import { debounce } from "lodash";

const SearchBar = ({ onElectionsFetched }) => {
  const [userInput, setUserInput] = useState("");
  const [allElections, setAllElections] = useState([]); // To store all fetched elections

  useEffect(() => {
    axios
      .get("election/upcoming-elections")
      .then((response) => {
        const elections = response.data;
        setAllElections(elections); // Store all elections
        onElectionsFetched(elections); // Call the callback with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching elections:", error);
        onElectionsFetched([]); // Pass empty array in case of error
      });
  }, [onElectionsFetched]);

  const handleSearch = useCallback(
    debounce((searchTerm) => {
      const filteredElections = allElections.filter((election) =>
        election.electionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onElectionsFetched(filteredElections); // Pass the filtered elections
    }, 300),
    [allElections, onElectionsFetched]
  );

  useEffect(() => {
    if (userInput.trim()) {
      handleSearch(userInput);
    } else {
      onElectionsFetched(allElections); // Pass all elections if search input is empty
    }
  }, [userInput, allElections, handleSearch]);

  return (
    <div>
      <SearchInput onSearchChange={setUserInput} />
    </div>
  );
};

export default SearchBar;
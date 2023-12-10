import React, { useState } from "react";

const SearchBar = () => {
  const [userInput, setUserInput] = useState("");

  const handleSearch = () => {
    // Assume you have a function to handle the search logic
    // For simplicity, let's just log the user input
    console.log(`User searched for: ${userInput}`);
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
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;

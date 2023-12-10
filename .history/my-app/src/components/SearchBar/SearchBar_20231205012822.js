import React, { useState } from 'react';

const SearchBar = () => {
  const [userInput, setUserInput] = useState('');

  const handleSearch = () => {
    // Assume you have a function to handle the search logic
    // For simplicity, let's just log the user input
    console.log(`User searched for: ${userInput}`);
  };
}
export default SearchBar;
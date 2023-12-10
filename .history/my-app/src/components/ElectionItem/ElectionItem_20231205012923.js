// ElectionItem.jsx
import React, { useState } from "react";

const ElectionItem = ({ election }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // Assume you have a function to save the election
    // For simplicity, let's just toggle the state
    setIsSaved(!isSaved);
  };

  return (
    <li>
      <strong>State:</strong> {election.state}, <strong>Date:</strong>{" "}
      {election.date}, <strong>Type:</strong> {election.type},{" "}
      <strong>Candidate:</strong> {election.candidate}
      <button onClick={handleSave}>{isSaved ? "Unsave" : "Save"}</button>
    </li>
  );
};

export default ElectionItem;

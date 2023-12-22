import React, { useState } from "react";

const ElectionItem = ({ election }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
s    setIsSaved(!isSaved);
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

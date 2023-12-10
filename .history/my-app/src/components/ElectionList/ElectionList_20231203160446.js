import React, { useState } from "react";
import axios from "axios";

const ElectionSearch = () => {
  const [stateInput, setStateInput] = useState("");
  const [zipCodeInput, setZipCodeInput] = useState("");
  const [elections, setElections] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get("/api/elections", {
        params: { state: stateInput, zipCode: zipCodeInput },
      });
      setElections(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="ElectionList">
      <label htmlFor="stateInput">Enter State:</label>
      <input
        type="text"
        id="stateInput"
        value={stateInput}
        onChange={(e) => setStateInput(e.target.value)}
      />

      <label htmlFor="zipCodeInput">Enter Zip Code:</label>
      <input
        type="text"
        id="zipCodeInput"
        value={zipCodeInput}
        onChange={(e) => setZipCodeInput(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      <ul>
        {elections.map((election) => (
          <li key={election.election_key}>
            {election.office_full} -{" "}
            {election.candidates.map((candidate) => candidate.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectionSearch;

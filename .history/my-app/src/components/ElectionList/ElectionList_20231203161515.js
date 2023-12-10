import React, { useState } from "react";
import axios from "axios";
import "./ElectionList.css"; // Import the CSS file

const ElectionList = () => {
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [zipCodeInput, setZipCodeInput] = useState("");
  const [elections, setElections] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get("/api/elections", {
        params: { state: stateInput, city: cityInput, zipCode: zipCodeInput },
      });
      setElections(response.data);
    } catch (error) {
      console.error("Error searching elections:", error);
    }
  };

  return (
    <div className="ElectionSearchContainer">
      <button onClick={handleSearch}>Search</button>

      <ul className="ResultsList">
        {elections.map((election) => (
          <li key={election.election_key}>
            <strong>{election.office_full}</strong> -{" "}
            {election.candidates.map((candidate) => candidate.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectionList;

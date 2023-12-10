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
      const response = await axios.get("http://localhost:3001/elections", {
        params: {
          state: stateInput,
          city: cityInput,
          zipCode: zipCodeInput,
        },
      });

      setElections(response.data.elections);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="ElectionSearchContainer">
      <label htmlFor="stateInput">Enter State:</label>
      <input
        type="text"
        id="stateInput"
        value={stateInput}
        onChange={(e) => setStateInput(e.target.value)}
      />

      <label htmlFor="cityInput">Enter City:</label>
      <input
        type="text"
        id="cityInput"
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
      />

      <label htmlFor="zipCodeInput">Enter Zip Code:</label>
      <input
        type="text"
        id="zipCodeInput"
        value={zipCodeInput}
        onChange={(e) => setZipCodeInput(e.target.value)}
      />

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

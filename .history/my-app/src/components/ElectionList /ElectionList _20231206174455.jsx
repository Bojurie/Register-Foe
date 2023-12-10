import React from "react";
import ElectionComponent from "./ElectionComponent";

const ElectionList = ({ elections }) => {
  return (
    <div className="ElectionList">
      <h3>Search Results:</h3>
      <ul>
        {elections.map((result) => (
          <li key={result.id}>
            {/* Render the ElectionComponent for each election */}
            <ElectionComponent
              date={result.date}
              city={result.city}
              state={result.state}
              candidates={result.candidates}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectionList;

import React from "react";
import ElectionComponent from "../ElectionComponent /ElectionComponent ";

const ElectionList = ({ elections }) => {
  return (
    <div className="ElectionList">
      <h3>Search Results:</h3>
      <ul>
      {if (someArray && someArray.length > 0) {
        elections.map((result) => (
          <li key={result.id}>
            <ElectionComponent
              date={result.date}
              city={result.city}
              state={result.state}
              candidates={result.candidates}
            />
          </li>
        ))}}
      </ul>
    </div>
  );
};

export default ElectionList;

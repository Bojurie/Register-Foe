import React from "react";
import ElectionComponent from "../ElectionComponent/ElectionComponent";
import SavedElections from "../SavedElections/SavedElections"; // Import SavedElections component

const ElectionList = ({ elections }) => {
  // Replace "user_id_here" with the actual user ID
  const userId = "user_id_here";

  return (
    <div className="ElectionList">
      <h3>Search Results:</h3>
      <ul>
        {elections && elections.length > 0 ? (
          elections.map((result) => (
            <li key={result.id}>
              <ElectionComponent
                date={result.date}
                city={result.city}
                state={result.state}
                candidates={result.candidates}
              />
            </li>
          ))
        ) : (
          <li>No results found.</li>
        )}
      </ul>
      {/* Include SavedElections component */}
      <SavedElections userId={userId} />
    </div>
  );
};

export default ElectionList;

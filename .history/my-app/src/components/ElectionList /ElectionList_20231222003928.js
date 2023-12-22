import React from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";
import SavedElections from "../SavedElections/SavedElections"; 

const ElectionList = ({ elections }) => {
  const userId = "user_id_here";
  return (
    <div className="ElectionList">
      <h3>Search Results:</h3>
      <ul>
        {elections && elections.length > 0 ? (
          elections.map((election) => (
            <li key={election._id}>
              <ElectionComponent
                date={election.date}
                city={election.city}
                state={election.state}
                candidates={election.candidates}
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

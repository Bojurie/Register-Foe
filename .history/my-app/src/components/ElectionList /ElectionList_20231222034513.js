import React from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";
// import SavedElections from "../SavedElections/SavedElections"; 

const ElectionList = ({ elections, userId }) => {
  return (
    <div className="ElectionList">
      <h3>Search Results:</h3>
      <ul>
        {elections && elections.length > 0 ? (
          elections.map((election) => (
            <li key={election._id}>
              <ElectionComponent electionId={election._id} userId={userId} />
            </li>
          ))
        ) : (
          <li>No results found.</li>
        )}
      </ul>
      {/* <SavedElections userId={userId} /> */}
    </div>
  );
};

export default ElectionList;
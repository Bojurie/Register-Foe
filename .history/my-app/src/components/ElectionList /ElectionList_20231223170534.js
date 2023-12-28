import React from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";


const ElectionList = ({ elections, userId }) => {
  return (
    <div className="ElectionList">
      <h2>Upcoming Election:</h2>
      <div>
        {elections.length > 0 ? (
          elections.map((election) => (
            <div key={election._id} className="ElectionComponent">
              <ElectionComponent electionId={election._id} userId={userId} />
            </div>
          ))
        ) : (
          <li>No results found.</li>
        )}
      </div>
    </div>
  );
};

export default ElectionList;
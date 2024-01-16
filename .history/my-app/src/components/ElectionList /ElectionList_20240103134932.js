import React from "react";
import './ElectionList.css';
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";


const ElectionList = ({ elections = [], userId }) => {
  return (
    <div className="ElectionList">
      <div className="ElectionComponentContainer">
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

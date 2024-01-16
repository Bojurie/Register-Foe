import React from "react";
import './ElectionList.css';
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";

const ElectionList = ({ elections = [] }) => {
  return (
    <div className="ElectionList">
      <div className="ElectionComponentContainer">
        {elections.length > 0 ? (
          elections.map((election) => (
            <ElectionComponent election={election} key={election._id} companyCode={election.companyCode} />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default ElectionList;
import React from "react";
import "./ElectionList.css";
import ElectionComponent from "../../components/ElectionComponent/ElectionComponent";

const ElectionList = ({ elections = [] }) => {
  return (
    <div className="ElectionList">
      {elections.length > 0 ? (
        elections.map((election) => (
          <ElectionComponent election={election} key={election._id} />
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default ElectionList;

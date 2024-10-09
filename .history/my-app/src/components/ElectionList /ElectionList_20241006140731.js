import React from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";
import "./ElectionList.css";


const ElectionList = ({ elections = [] }) => {
  return (
    <div className="ElectionList">
      {elections.length > 0 ? (
        elections.map((election) =>
          election ? (
            <ElectionComponent key={election._id} election={election} />
          ) : (
            <p key={Math.random()}>Election details not available.</p>
          )
        )
      ) : (
        <p>No upcoming elections found.</p>
      )}
    </div>
  );
};

export default ElectionList;

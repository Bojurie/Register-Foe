import React from "react";
import ElectionComponent from "../ElectionComponent/ ElectionComponent";
import "./ElectionList.css";

const ElectionList = ({ elections = [], postElectionVote }) => {
  return (
    <div className="ElectionList-Wrapper">
      <h2 className="Heading">Upcoming Elections</h2>
      <div className="ElectionList">
        {elections.length > 0 ? (
          elections.map((election) => (
            <ElectionComponent
              key={election._id}
              election={election}
              postElectionVote={postElectionVote}
            />
          ))
        ) : (
          <p>No upcoming elections found.</p>
        )}
      </div>
    </div>
  );
};

export default ElectionList;

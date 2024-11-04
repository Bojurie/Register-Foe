import React from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";
import "./ElectionList.css";
import { ElectionListWrapper } from "../StyledComponents";


const ElectionList = ({ elections = [], postElectionVote }) => {
  return (
    <ElectionListWrapper className="ElectionList-Wrapper">
      <h2 className="ElectionList-Heading">Upcoming Elections</h2>
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
          <p className="NoElectionsMessage">No upcoming elections found.</p>
        )}
      </div>
    </ElectionListWrapper>
  );
};

export default ElectionList;

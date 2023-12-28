import React from "react";

const PastElectionItem = ({ pastElection }) => {
  return (
    <div className="PastElectionItem">
      <p>Election Date: {pastElection.election.date}</p>
      <p>City: {pastElection.election.city}</p>
      <p>State: {pastElection.election.state}</p>
      <p>Description: {pastElection.election.description}</p>
    </div>
  );
};

export default PastElectionItem;

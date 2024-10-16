import React from "react";
import './PastElectionItem.css'

const PastElectionItem = ({ pastElection }) => {
  return (
    <div className="PastElectionItem">

      <p>Election Date: {pastElection.election.title}</p>
      <p>Election Date: {pastElection.election.startDate}</p>
      <p>Election Date: {pastElection.election.endDate}</p>
      <p>City: {pastElection.election.city}</p>
      <p>State: {pastElection.election.state}</p>
      <p>Description: {pastElection.election.description}</p>
    </div>
  );
};

export default PastElectionItem;

import React from "react";
import "./PastElectionItem.css";

const PastElectionItem = ({ pastElection, totalVotes, winningCandidate }) => {
  return (
    <div className="PastElectionItem">
      <h3>{pastElection.title}</h3>
      <p>
        <strong>Start Date:</strong>{" "}
        {new Date(pastElection.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>End Date:</strong>{" "}
        {new Date(pastElection.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>City:</strong> {pastElection.city}
      </p>
      <p>
        <strong>State:</strong> {pastElection.state}
      </p>
      <p>
        <strong>Description:</strong> {pastElection.description}
      </p>

      {/* Total Votes */}
      <p>
        <strong>Total Votes:</strong> {totalVotes}
      </p>

      {/* Winning Candidate */}
      {winningCandidate ? (
        <div className="winning-candidate">
          <h4>Winning Candidate</h4>
          <p>
            <strong>Name:</strong> {winningCandidate.firstName}{" "}
            {winningCandidate.lastName}
          </p>
          <p>
            <strong>Votes Count:</strong> {winningCandidate.votesCount}
          </p>
        </div>
      ) : (
        <p>No winning candidate information available.</p>
      )}
    </div>
  );
};

export default PastElectionItem;

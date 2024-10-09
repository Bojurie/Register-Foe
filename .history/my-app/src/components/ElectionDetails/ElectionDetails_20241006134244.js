import React from "react";
import Profile from "../Profile/Profile";
import "./ElectionDetails.css";

const ElectionDetails = ({ election }) => {
  return (
    <div className="ElectionDetails">
      <h1>{election.title}</h1>
      <div className="election-info">
        <p>
          <span>Type of Election:</span> {election.electionType}
        </p>
        <p>
          <span>Start Date:</span>{" "}
          {new Date(election.startDate).toLocaleDateString()}
        </p>
        <p>
          <span>End Date:</span>{" "}
          {new Date(election.endDate).toLocaleDateString()}
        </p>
        <p>
          <span>City:</span> {election.city}
        </p>
        <p>
          <span>State:</span> {election.state}
        </p>
        <p>
          <span>About:</span> {election.description}
        </p>
      </div>
      <div className="candidates-section">
        <h3>Candidates</h3>
        <div className="candidates-grid">
          {election.candidates && election.candidates.length > 0 ? (
            election.candidates.map((candidate) => (
              <Profile key={candidate._id} user={candidate} isCandidate />
            ))
          ) : (
            <p>No candidates to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionDetails;

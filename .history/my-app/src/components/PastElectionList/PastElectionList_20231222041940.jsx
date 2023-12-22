import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PastElectionList.css";

const PastElectionList = ({ userId }) => {
  const [pastElections, setPastElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:3001/";

  useEffect(() => {
    axios
      .get(`${BASE_URL}pastElection/past-elections/voted/${userId}`) // Assuming the correct endpoint
      .then((response) => {
        const fetchedVotedPastElections = response.data.votedPastElections;
        setPastElections(fetchedVotedPastElections);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="PastElections">
      <h2>Past Elections</h2>
      {loading && <p>Loading past elections...</p>}
      {error && <p>Error loading past elections: {error.message}</p>}
      {pastElections.length > 0 ? (
        <div>
          {pastElections.map((pastElection) => (
            <div key={pastElection._id}>
              <p>Election Date: {pastElection.election.date}</p>
              <p>City: {pastElection.election.city}</p>
              <p>State: {pastElection.election.state}</p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No past elections found.</p>
      )}
    </div>
  );
};

export default PastElectionList;

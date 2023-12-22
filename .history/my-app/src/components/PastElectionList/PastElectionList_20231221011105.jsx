import React, { useEffect, useState } from "react";
import axios from "axios";

const PastElectionList = ({ userId }) => {
  const [pastElections, setPastElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/past-elections/user/${userId}`)
      .then((response) => {
        const fetchedPastElections = response.data.pastElections;
        setPastElections(fetchedPastElections);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="PastElections">
        <h2>Past Elections</h2>
        <p>Loading past elections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="PastElections">
        <h2>Past Elections</h2>
        <p>Error loading past elections: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="PastElections">
      <h2>Past Elections</h2>
      <div>
        {pastElections.map((pastElection) => (
          <div key={pastElection._id}>
            <p>Election Date: {pastElection.election.date}</p>
            <p>City: {pastElection.election.city}</p>
            <p>State: {pastElection.election.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastElectionList;

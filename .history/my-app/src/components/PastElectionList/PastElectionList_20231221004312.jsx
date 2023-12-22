import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavigation from "../DashboardNavigation/DashboardNavigation";

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
    return <p>Loading past elections...</p>;
  }

  if (error) {
    return <p>Error loading past elections: {error.message}</p>;
  }

  return (
    <div className="PastElections">
      <h2>Past Elections</h2>
      <ul>
        {pastElections.map((pastElection) => (
          <li key={pastElection._id}>
            <p>Election Date: {pastElection.election.date}</p>
            <p>City: {pastElection.election.city}</p>
            <p>State: {pastElection.election.state}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastElectionList;

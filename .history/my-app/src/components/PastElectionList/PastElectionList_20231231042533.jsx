import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PastElectionList.css";
import PastElectionItem from "../PastElectionItem/PastElectionItem";

const PastElections = ({ userId }) => {
  const [pastElections, setPastElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/pastElection/past-elections/voted/${userId}`)
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
        <motion.div
          className="PastElections-Item"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {pastElections.map((pastElection) => (
            <PastElectionItem
              key={pastElection._id}
              pastElection={pastElection}
            />
          ))}
        </motion.div>
      ) : (
        !loading && <p>No past elections found.</p>
      )}
    </div>
  );
};

export default PastElections;
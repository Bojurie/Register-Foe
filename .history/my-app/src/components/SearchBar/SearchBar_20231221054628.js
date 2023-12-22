import React, { useState, useEffect } from "react";
import './SearchBar.css'
import { Link } from "react-router-dom"; // Import Link from React Router
import axios from "axios";
import ElectionComponent from '../ElectionComponent /ElectionComponent ';

const ElectionList = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get("/auth/election/demo/upcoming-elections")
      .then((response) => {
        const elections = response.data;
        setUpcomingElections(elections);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching upcoming elections:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="SearchBar">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {upcomingElections.map((election) => (
        <div key={election._id}>
          <Link to={`/elections/${election._id}`}>
            {" "}
            {/* Link to the election details page */}
            <h3>{election.electionName}</h3>
            <p>Election Date: {election.electionDate}</p>
            <p>Constituency: {election.constituency}</p>
          </Link>
          <ElectionComponent election={election} />{" "}
          {/* Render the ElectionDetail component */}
        </div>
      ))}
    </div>
  );
};

export default ElectionList;

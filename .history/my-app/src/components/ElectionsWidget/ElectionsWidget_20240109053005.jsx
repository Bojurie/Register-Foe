import React, { useState, useEffect } from "react";
import axios from "axios";
import ElectionItem from "../ElectionComponent/ElectionItem/ElectionItem";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionsWidget = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [error, setError] = useState("");
  const {getElection} =  useAuth()

  useEffect(() => {
    const fetchUpcomingElections = async () => {
      try {
        const response = await getElection();
        if (response && response.data) {
          setUpcomingElections(response.data);
        } else {
          throw new Error("Invalid response from the server");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Error fetching upcoming elections";
        console.error("Error fetching upcoming elections:", errorMessage);
        setError(errorMessage);
      }
    };

    fetchUpcomingElections();
  }, []);

  return (
    <div className="ElectionsWidget">
      <h2>Upcoming Elections</h2>
    
        <ul>
          {upcomingElections.map((election) => (
            <ElectionItem key={election._id} election={election} />
          ))}
        </ul>
    </div>
  );
};

export default ElectionsWidget;

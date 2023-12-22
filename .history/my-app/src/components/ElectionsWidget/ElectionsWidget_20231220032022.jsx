import React, { useState, useEffect } from "react";
import axios from "axios";
import ElectionItem from "../ElectionItem/ElectionItem";

const ElectionsWidget = () => {
  const [error, setError] = useState("");

  return (
    <div className="ElectionsWidget">
      <h2>Upcoming Elections</h2>
      {error ? (
        <p>Error fetching elections: {error}</p>
      ) : (
        <ul>
          {upcomingElections.map((election) => (
            <ElectionItem key={election.id} election={election} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ElectionsWidget;

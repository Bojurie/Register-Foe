import React from "react";

const LocationInfo = ({ currentDateTime, city, state, country }) => {
  // Check if currentDateTime is available
  if (!currentDateTime) {
    return <div>Loading...</div>; // Fallback UI if current date/time is not available
  }

  return (
    <div className="LocationInfo">
      <div className="CurrentTime">
        <p>{currentDateTime.time}</p> {/* Display current time */}
      </div>
      <div className="Location">
        <p>{`${city}, ${state}, ${country}`}</p> {/* Display location */}
      </div>
      <p>{currentDateTime.date}</p> {/* Display current date */}
    </div>
  );
};

export default LocationInfo;

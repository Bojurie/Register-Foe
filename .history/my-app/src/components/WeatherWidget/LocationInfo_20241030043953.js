import React from "react";

const LocationInfo = ( locationData ) => {

  return (
    <div className="LocationInfo">
      <div className="CurrentTime">
        <p>{locationData.time}</p> {/* Display current time */}
      </div>
      <div className="Location">
        <p>{`${locationData.city}, ${locationData.state}, ${locationData.country}`}</p>{" "}
        {/* Display location */}
      </div>
      <p>{locationData.date}</p> {/* Display current date */}
    </div>
  );
};

export default LocationInfo;

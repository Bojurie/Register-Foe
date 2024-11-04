import React from "react";

const LocationInfo = ({ currentDateTime, city, state, country }) => {
  return (
    <div className="LocationInfo">
      <div className="CurrentTime">
        <p>{currentDateTime.time}</p>
      </div>
      <div className="Location">
        <p>{`${city}, ${state}, ${country}`}</p>
      </div>
      <p>{currentDateTime.date}</p>
    </div>
  );
};

export default LocationInfo;

import React from "react";
import { mockLocationData } from "./mockWeatherData";

const LocationInfo = ({ currentDateTime, city }) => {
  const locationData = mockLocationData[city] || {};

  return (
    <div className="LocationInfo">
      <div className="CurrentTime">
        <p>{currentDateTime.time}</p>
      </div>
      <div className="Location">
        <p>{`${locationData.city || city}, ${locationData.state || ""}, ${
          locationData.country || ""
        }`}</p>
      </div>
      <p>{currentDateTime.date}</p>
    </div>
  );
};

export default LocationInfo;

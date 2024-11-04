import React from "react";
import { mockLocationData } from "./mockWeatherData";

const LocationInfo = ({ currentDateTime, city }) => (
  <div className="LocationInfo">
    <div className="CurrentTime">
      <p>{currentDateTime.time}</p>
    </div>
    <div className="Location">
      <p>{`${mockLocationData[city].city}, ${
        mockLocationData[city].state || ""
      }, ${mockLocationData[city].country}`}</p>
    </div>
    <p>{currentDateTime.date}</p>
  </div>
);

export default LocationInfo;

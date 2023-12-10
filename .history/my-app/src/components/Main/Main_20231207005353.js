import React, { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider, useAuth } from "../AuthContext/AuthContext";
import LocationFetcher from "../LocationFetcher/LocationFetcher";
// import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  // const [currentTime, setCurrentTime] = useState("");
  // const [currentLocation, setCurrentLocation] = useState({
  //   city: "",
  //   state: "",
  // });
  // const [currentWeather, setCurrentWeather] = useState({
  //   description: "",
  // });

  // const handleLocationSuccess = (locationData) => {
  //   setCurrentLocation({
  //     city: locationData.city || "Unknown",
  //     state: locationData.state || "Unknown",
  //   });
  // };

  // const handleWeatherSuccess = (weatherData) => {
  //   setCurrentWeather({
  //     description:
  //       weatherData.weather && weatherData.weather.length > 0
  //         ? weatherData.weather[0].description
  //         : "Unknown",
  //   });
  // };

  // const handleFetchError = () => {
  //   // Handle errors if needed
  // };

  return (
    <div className="Main">
      <AuthProvider>
        {isAuthenticated && (
          <>
            <LocationFetcher
              // onSuccess={handleLocationSuccess}
              // onError={handleFetchError}
            />
            {/* <WeatherFetcher
              city={currentLocation.city}
              onSuccess={handleWeatherSuccess}
              onError={handleFetchError}
            /> */}
            <Dashboard
              user={user}
              // currentTime={currentTime}
              // currentLocation={currentLocation}
              // currentWeather={currentWeather}
            />
          </>
        )}
      </AuthProvider>
    </div>
  );
};

export default Main;

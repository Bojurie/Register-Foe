import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import { useAuth } from "../AuthContext/AuthContext";
import LocationFetcher from "../LocationFetcher/LocationFetcher";
// import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";

const Main = () => {
  const { user, isAuthenticated } = useAuth();

  // Uncomment and implement these states and handlers if needed
  // const [currentTime, setCurrentTime] = useState("");
  // const [currentLocation, setCurrentLocation] = useState({ city: "", state: "" });
  // const [currentWeather, setCurrentWeather] = useState({ description: "" });

  // const handleLocationSuccess = (locationData) => {
  //   setCurrentLocation({ city: locationData.city || "Unknown", state: locationData.state || "Unknown" });
  // };

  // const handleWeatherSuccess = (weatherData) => {
  //   setCurrentWeather({ description: weatherData.weather[0]?.description || "Unknown" });
  // };

  // const handleFetchError = (error) => {
  //   // Handle errors if needed
  // };

  return (
    <div className="Main">
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
            key={user.id}
            // currentTime={currentTime}
            // currentLocation={currentLocation}
            // currentWeather={currentWeather}
          />
        </>
      )}
    </div>
  );
};

export default Main;

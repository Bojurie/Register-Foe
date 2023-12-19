import React, {useState}from "react";
import Dashboard from "../Dashboard/Dashboard";
import { useAuth } from "../AuthContext/AuthContext";
import LocationFetcher from "../LocationFetcher/LocationFetcher";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState({
    city: "",
    state: "",
    timeZone: "",
  });
  const [currentWeather, setCurrentWeather] = useState({ description: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLocation.timeZone) {
        const newTime = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: currentLocation.timeZone,
        }).format(new Date());
        setCurrentTime(newTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentLocation.timeZone]);

  const handleLocationSuccess = (locationData) => {
    setCurrentLocation({
      city: locationData.city || "Unknown",
      state: locationData.state || "Unknown",
      timeZone: locationData.timeZone || "UTC", // Assuming you have timeZone in locationData
    });
  };

  const handleFetchError = (error) => {
    // Handle errors if needed
  };

  return (
    <div className="Main">
      {isAuthenticated && (
        <>
          <LocationFetcher
          onSuccess={handleLocationSuccess}
          onError={handleFetchError}
          />
          <WeatherFetcher
            city={currentLocation.city}
            onSuccess={handleWeatherSuccess}
            onError={handleFetchError}
          />
          <Dashboard
            user={user}
            key={user.id}
            currentTime={currentTime}
            currentLocation={currentLocation}
            currentWeather={currentWeather}
          />
        </>
      )}
    </div>
  );
};

export default Main;

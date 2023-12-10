import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider, useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentLocation, setCurrentLocation] = useState({
    city: "",
    state: "",
  });
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    const timeIntervalId = setInterval(updateTime, 1000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`)
            .then((response) => response.json())
            .then((data) => {
              setCurrentLocation({
                city: data.city || "Unknown",
                state: data.state || "Unknown",
              });
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
              setCurrentLocation({ city: "Unknown", state: "Unknown" });
            })
            .finally(() => setLoading(false));
        },
        (error) => {
          console.error("Error fetching location:", error);
          setCurrentLocation({ city: "Unknown", state: "Unknown" });
          setLoading(false);
        }
      );
    }

    return () => {
      clearInterval(timeIntervalId);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Main">
      <AuthProvider>
        {isAuthenticated && (
          <Dashboard
            user={user}
            currentTime={currentTime}
            currentLocation={currentLocation}
            currentWeather={currentWeather}
          />
        )}
      </AuthProvider>
      {/* <ElectionList /> */}
    </div>
  );
};

export default Main;
import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider, useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentLocation, setCurrentLocation] = useState({
    city: "New York",
    state: "NY",
  });

  useEffect(() => {
    // Example: Fetch or set the current time (replace with your logic)
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Example: Fetch or set the current location (replace with your logic)
    // For simplicity, let's assume a delay using setTimeout
    const timeoutId = setTimeout(() => {
      setCurrentLocation({ city: "Los Angeles", state: "CA" });
    }, 2000);

    // Cleanup intervals and timeouts on component unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="Main">
      <AuthProvider>
        {isAuthenticated && (
          <Dashboard
            user={user}
            currentTime={currentTime}
            currentLocation={currentLocation}
          />
        )}
      </AuthProvider>
      {/* <ElectionList /> */}
    </div>
  );
};

export default Main;

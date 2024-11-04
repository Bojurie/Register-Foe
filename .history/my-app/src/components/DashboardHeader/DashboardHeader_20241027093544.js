import React, { useEffect, useState } from "react";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import "./DashboardHeader.css";

const DashboardHeader = ({ user }) => {
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
        return;
      }

      try {
        await navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "denied") {
              setError("Location access denied.");
              setLoading(false);
            }
          });

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocationData({ latitude, longitude });
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching location:", error);
            setError("Could not fetch your location.");
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("Error accessing geolocation permissions:", error);
        setError("Failed to access location. Please check your permissions.");
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="CompanyDashboard-Top">
      <h1>
        Welcome,{" "}
        {user?.companyName ||
          `${user?.firstName || "User"} ${user?.lastName || ""}`}
        !
      </h1>
      {error && <p className="Error">{error}</p>}
      {loading ? (
        <p>Loading weather...</p>
      ) : locationData ? (
        <WeatherWidget locationData={locationData} />
      ) : (
        <p>No location data available.</p>
      )}
    </div>
  );
};

export default DashboardHeader;

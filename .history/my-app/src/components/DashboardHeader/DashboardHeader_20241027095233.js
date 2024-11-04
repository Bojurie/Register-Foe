import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import "./DashboardHeader.css";

const DashboardHeader = ({ user }) => {
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLocationDetails = async (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
    if (!apiKey) {
      console.error("OpenCage API key is missing.");
      setError("Location service is unavailable.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: `${latitude},${longitude}`,
            key: apiKey,
            language: "en",
          },
        }
      );

      const { results } = response.data;
      if (results && results.length > 0) {
        const { city, state, country } = results[0].components;
        setLocationData({
          latitude,
          longitude,
          city: city || "Unknown City",
          state: state || "Unknown State",
          country: country || "Unknown Country",
        });
        console.log("Full location details:", { city, state, country });
      } else {
        setError("Unable to fetch location details.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching location details:", error);
      setError("Could not fetch your location.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location fetched:", { latitude, longitude });
          fetchLocationDetails(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setError("Could not fetch your location.");
          setLoading(false);
        }
      );
    };

    getLocation();
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

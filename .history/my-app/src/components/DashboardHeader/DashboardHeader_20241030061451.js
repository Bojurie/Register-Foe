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

      // Log the full response data for debugging
      console.log("Full API Response:", response.data);

      const { results } = response.data;
      if (results && results.length > 0) {
        const { city, state, postcode, country } = results[0].components;
        const timezone = results[0].annotations.timezone.name;

        // Log each component to verify data extraction
        console.log("Extracted City:", city);
        console.log("Extracted State:", state);
        console.log("Extracted Zip Code:", postcode);
        console.log("Extracted Country:", country);
        console.log("Extracted Timezone:", timezone);

        const currentDateTime = new Date(
          new Date().toLocaleString("en-US", { timeZone: timezone })
        );

        setLocationData({
          latitude,
          longitude,
          city: city || "Unknown City",
          state: state || "Unknown State",
          zipCode: postcode || "Unknown Zip Code",
          country: country || "Unknown Country",
          time: currentDateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          date: currentDateTime.toLocaleDateString(),
        });
      } else {
        setError("Unable to fetch location details.");
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      setError("Could not fetch your location.");
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Log coordinates to confirm geolocation success
      console.log("User Coordinates:", { latitude, longitude });

      await fetchLocationDetails(latitude, longitude);
    } catch (error) {
      console.error("Error fetching location:", error);
      setError(
        "Could not fetch your location. Please ensure location services are enabled."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <p>Loading location and weather...</p>
      ) : locationData ? (
        <WeatherWidget locationData={locationData} />
      ) : (
        <p>No location data available.</p>
      )}
    </div>
  );
};

export default DashboardHeader;

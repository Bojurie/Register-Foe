import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import ElectionDisplayFetcher from "../ElectionDisplayFetcher";
import "./DashboardHeader.css";

const DashboardHeader = ({ user }) => {
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLocationDetails = async (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
    if (!apiKey) {
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
      if (results?.length > 0) {
        const {
          city,
          state,
          postcode: zipCode,
          country,
        } = results[0].components;
        const timezone = results[0].annotations.timezone.name;
        const currentDateTime = new Date(
          new Date().toLocaleString("en-US", { timeZone: timezone })
        );

        setLocationData({
          latitude,
          longitude,
          city: city || "Unknown City",
          state: state || "Unknown State",
          zipCode: zipCode || "Unknown Zip Code",
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
    } catch (err) {
      setError("Could not fetch your location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchLocationDetails(
          position.coords.latitude,
          position.coords.longitude
        ),
      () => {
        setError(
          "Could not fetch your location. Please enable location services."
        );
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="DashboardHeader">
      <h1>
        Welcome,{" "}
        {user?.companyName ||
          `${user?.firstName || "User"} ${user?.lastName || ""}`}
        !
      </h1>
      <ElectionDisplayFetcher />
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading location and weather...</p>
      ) : (
        <WeatherWidget locationData={locationData} />
      )}
    </div>
  );
};

export default DashboardHeader;

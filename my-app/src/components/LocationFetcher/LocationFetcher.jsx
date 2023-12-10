// LocationFetcher.js
import React, { useState, useEffect } from "react";

const LocationFetcher = ({ onSuccess, onError }) => {
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by your browser");
        }

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          console.warn(
            `Warning: Error fetching location - Status: ${response.status}`
          );
          onError(); // Notify the parent component about the error
        } else {
          const data = await response.json();
          onSuccess(data); // Pass the location data to the parent component
        }
      } catch (error) {
        console.error("Error fetching location:", error.message);
        onError();
      }
    };

    fetchLocation();
  }, [onSuccess, onError]);

  return null; // No need to render anything, as this component is only for side effects
};

export default LocationFetcher;

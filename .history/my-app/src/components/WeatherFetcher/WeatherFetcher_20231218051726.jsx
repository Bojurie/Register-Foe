import {useEffect } from "react";

const WeatherFetcher = ({ city, onSuccess, onError }) => {
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `/api/current-weather?city=${encodeURIComponent(city)}`
        );

        console.log("Weather API Response:", response);

        if (!response.ok) {
          console.warn(
            `Warning: Error fetching weather - Status: ${response.status}`
          );
          onError(); // Notify the parent component about the error
        } else {
          const data = await response.json();
          onSuccess(data); // Pass the weather data to the parent component
        }
      } catch (error) {
        console.error("Error fetching weather:", error.message);
        onError();
      }
    };

    fetchWeather();
  }, [city, onSuccess, onError]);

  return null; // No need to render anything, as this component is only for side effects
};

export default WeatherFetcher;

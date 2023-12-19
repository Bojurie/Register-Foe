import { useEffect } from "react";
import axios from "axios";

const WeatherFetcher = ({ city, onSuccess, onError }) => {
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get("/api/current-weather", {
          params: { city: encodeURIComponent(city) },
        });

        console.log("Weather API Response:", response);

        onSuccess(response.data); // Pass the weather data to the parent component
      } catch (error) {
        console.error("Error fetching weather:", error.message);
        onError(error.message); // Pass the error message to the parent component
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city, onSuccess, onError]);

  // No need to render anything, as this component is only for side effects
  return null;
};

export default WeatherFetcher;

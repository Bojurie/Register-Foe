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

        onSuccess(response.data); 
      } catch (error) {
        console.error("Error fetching weather:", error.message);
        onError(error.message); 
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city, onSuccess, onError]);

  return null;
};

export default WeatherFetcher;

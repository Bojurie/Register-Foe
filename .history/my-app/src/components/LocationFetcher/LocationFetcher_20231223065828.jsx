import { useEffect } from "react";
import axios from "axios";

const useLocation = ({ onSuccess, onError }) => {
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by your browser");
        }
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(
              `https://api.openweathermap.org/geo/2.5/reverse`, 
              {
                params: {
                  lat: latitude,
                  lon: longitude,
                  limit: 1, // Assuming you want to limit the results to 1
                  appid: process.env.GEO_API_KEY,
                },
              }
            );
            onSuccess(response.data);
          },
          (error) => {
            throw error;
          }
        );
      } catch (error) {
        console.error("Error fetching location:", error.message || error);
        onError(error.message || error);
      }
    };

    fetchLocation();
  }, [onSuccess, onError]);
};

export default useLocation;

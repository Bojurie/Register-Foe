import { useEffect } from "react";
import axios from "axios";

const useLocation = ({ onSuccess, onError }) => {
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
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=${process.env.GEO_API_KEY}
`,
          {
            params: { lat: latitude, lon: longitude },
          }
        );

        onSuccess(response.data);
      } catch (error) {
        console.error("Error fetching location:", error);
        onError(error.message);
      }
    };

    fetchLocation();
  }, [onSuccess, onError]);
};

export default useLocation;

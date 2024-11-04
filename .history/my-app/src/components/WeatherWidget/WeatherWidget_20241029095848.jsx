
// import React, { useState, useEffect, useCallback } from "react";
// import { DateTime } from "luxon";
// import { motion } from "framer-motion";
// import { useTheme } from "../ThemeProvider"; 
// import WeatherInfo from "./WeatherInfo";
// import LocationInfo from "./LocationInfo";
// import "./WeatherWidget.css";
// import { mockLocationData } from "./mockWeatherData";

// const WeatherWidget = () => {
//   const { currentTheme, updateTheme } = useTheme();
//   const [weather, setWeather] = useState(null);
//   const [error, setError] = useState("");
//   const [currentDateTime, setCurrentDateTime] = useState({});
//   const [city, setCity] = useState("");

//   const randomCity = useCallback(() => {
//     const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];
//     const randomCity = cities[Math.floor(Math.random() * cities.length)];
//     setCity(randomCity);
//   }, []);

//   const updateCurrentDateTime = (timeZone) => {
//     const now = DateTime.now().setZone(timeZone || "UTC");
//     setCurrentDateTime({
//       date: now.toLocaleString(DateTime.DATE_HUGE),
//       time: now.toLocaleString(DateTime.TIME_SIMPLE),
//     });
//   };

//   const fetchWeatherData = useCallback(async () => {
//     try {
//       const response = await fetch(
//         `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${city}`
//       );
//       if (!response.ok)
//         throw new Error("Weather data not available for this location.");

//       const data = await response.json();
//       const {
//         temp_c: temp,
//         condition: { text: description, icon },
//       } = data.current;

//       setWeather({
//         temperature: temp,
//         description,
//         weatherIcon: icon,
//       });
//       updateCurrentDateTime(data.location.tz_id);
//     } catch (error) {
//       setError(error.message);
//       setWeather(null);
//     }
//   }, [city]);



//   useEffect(() => {
//     randomCity();
//   }, [randomCity]);

//   useEffect(() => {
//     if (city) fetchWeatherData();
//   }, [fetchWeatherData, city]);

//   useEffect(() => {
//     if (weather) {
//       const hour = new Date().getHours();
//       updateTheme(weather.weatherIcon, hour);
//     }
//   }, [weather, updateTheme]);

//   return (
//     <div
//       style={{ background: currentTheme.background, color: currentTheme.color }}
//       className="weather"
//     >
//       {error ? (
//         <p className="Error">{error}</p>
//       ) : weather ? (
//         <motion.div
//           className="WeatherWidget-Content"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//         >
//           <LocationInfo currentDateTime={currentDateTime} city={city} />
//           <WeatherInfo weather={weather} />
//         </motion.div>
//       ) : (
//         <p>Loading weather...</p>
//       )}
//     </div>
//   );
// };

// export default WeatherWidget;

import React, { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider"; // Ensure correct import
import WeatherInfo from "./WeatherInfo";
import LocationInfo from "./LocationInfo";
import "./WeatherWidget.css";
import { mockWeatherData } from "./mockWeatherData"; // Adjust the import to match your file structure

const WeatherWidget = () => {
  const { currentTheme, updateTheme } = useTheme();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({});
  const [city, setCity] = useState("");

  // Function to randomly select a city for demonstration purposes
  const randomCity = useCallback(() => {
    const cities = ["NewYork", "London", "Tokyo"]; // Use keys from mockWeatherData
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    setCity(randomCity);
  }, []);

  // Function to update the current date and time based on timezone
  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString(DateTime.DATE_HUGE),
      time: now.toLocaleString(DateTime.TIME_SIMPLE),
    });
  };

  // Function to simulate fetching weather data using mock data
  const fetchWeatherData = useCallback(() => {
    const data = mockWeatherData.locations[city]; // Access the specific city's weather data

    if (!data) {
      setError("Weather data not available.");
      setWeather(null);
      return;
    }

    const {
      current: { temp, weather },
      timezone,
    } = data;

    setWeather({
      temperature: temp,
      description: weather[0].description,
      weatherIcon: weather[0].icon, // Assuming the icon is a string like "01d"
    });

    // Update current date and time based on the timezone from mock data
    updateCurrentDateTime(timezone);
  }, [city]);

  useEffect(() => {
    randomCity();
  }, [randomCity]);

  useEffect(() => {
    if (city) fetchWeatherData(); // Call mock data function instead
  }, [fetchWeatherData, city]);

  useEffect(() => {
    if (weather) {
      const hour = new Date().getHours();
      updateTheme(weather.weatherIcon, hour);
    }
  }, [weather, updateTheme]);

return (
  <div
    style={{ background: currentTheme.background, color: currentTheme.color }}
    className="WeatherWidget"
  >
    {error ? (
      <p className="Error">{error}</p>
    ) : weather ? (
      <motion.div
        className="WeatherWidget-Content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <LocationInfo currentDateTime={currentDateTime} city={city} />
        <WeatherInfo weather={weather} />
      </motion.div>
    ) : (
      <p>Fetching weather data... Please wait.</p> // Updated message
    )}
  </div>
);


export default WeatherWidget;

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { DateTime } from "luxon";
// import {
//   WiDaySunny,
//   WiRain,
//   WiSnow,
//   WiCloudy,
//   WiThunderstorm,
//   WiNightClear,
// } from "react-icons/wi";
// import { motion } from "framer-motion";
// import "./WeatherWidget.css";

// const WeatherWidget = ({ locationData }) => {
//   const [weather, setWeather] = useState(null);
//   const [error, setError] = useState("");
//   const [currentDateTime, setCurrentDateTime] = useState({});
//   const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

// const fetchWeatherData = useCallback(async () => {
//   const { latitude, longitude } = locationData;

//   if (!API_KEY) {
//     setError("API key is missing. Please provide a valid API key.");
//     return;
//   }
//   if (!latitude || !longitude) {
//     setError("Location data is incomplete.");
//     return;
//   }

//   try {
//     const response = await axios.get(
//       `https://api.openweathermap.org/data/2.5/onecall`,
//       {
//         params: {
//           lat: latitude,
//           lon: longitude,
//           exclude: "hourly,daily",
//           appid: API_KEY,
//           units: "metric",
//         },
//       }
//     );

//     const { temp, weather: weatherInfo } = response.data.current;
//     const { description, icon } = weatherInfo[0];

//     setWeather({
//       temperature: temp,
//       description,
//       weatherIcon: icon,
//     });
//     updateCurrentDateTime(response.data.timezone);
//   } catch (error) {
//     console.error("Error fetching weather data:", error);
//     setError("Could not fetch weather data. Please try again later.");
//   }
// }, [locationData, API_KEY]);


//   const updateCurrentDateTime = (timeZone) => {
//     const now = DateTime.now().setZone(timeZone || "UTC");
//     setCurrentDateTime({
//       date: now.toLocaleString(DateTime.DATE_HUGE),
//       time: now.toLocaleString(DateTime.TIME_SIMPLE),
//     });
//   };

//   const getWeatherIcon = (weatherCode) => {
//     const animationProps = {
//       initial: { opacity: 0, scale: 0.9 },
//       animate: { opacity: 1, scale: 1.1 },
//       transition: { repeat: Infinity, duration: 2, repeatType: "mirror" },
//     };

//     switch (weatherCode) {
//       case "01d":
//         return (
//           <motion.div {...animationProps}>
//             <WiDaySunny />
//           </motion.div>
//         );
//       case "01n":
//         return (
//           <motion.div {...animationProps}>
//             <WiNightClear />
//           </motion.div>
//         );
//       case "02d":
//       case "02n":
//       case "03d":
//       case "03n":
//       case "04d":
//       case "04n":
//         return (
//           <motion.div {...animationProps}>
//             <WiCloudy />
//           </motion.div>
//         );
//       case "09d":
//       case "09n":
//       case "10d":
//       case "10n":
//         return <RainAnimation />;
//       case "11d":
//       case "11n":
//         return <ThunderstormAnimation />;
//       case "13d":
//       case "13n":
//         return <SnowAnimation />;
//       default:
//         return (
//           <motion.div {...animationProps}>
//             <WiCloudy />
//           </motion.div>
//         );
//     }
//   };

//   useEffect(() => {
//     if (locationData?.latitude && locationData?.longitude) {
//       fetchWeatherData();
//     }
//   }, [locationData, fetchWeatherData]);

//   return (
//     <motion.div
//       className="WeatherWidget"
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.8, ease: "easeInOut" }}
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
//           <motion.div className="CurrentTime">
//             <p>{currentDateTime.time}</p>
//           </motion.div>
//           <motion.div className="Location">
//             <p>{`${locationData.city || "Your City"}, ${
//               locationData.state || "Your State"
//             }, ${locationData.country || "Your Country"}`}</p>
//           </motion.div>
//           <p>{currentDateTime.date}</p>
//           <motion.div className="Temperature">
//             <motion.div
//               className="WeatherIcon"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1.2 }}
//               transition={{
//                 repeat: Infinity,
//                 duration: 2,
//                 repeatType: "mirror",
//               }}
//             >
//               {getWeatherIcon(weather.weatherIcon)}
//             </motion.div>
//             <motion.div className="WeatherDescription">
//               <p>
//                 {`${weather.temperature}°C`} <span>{weather.description}</span>
//               </p>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       ) : (
//         <p>Loading weather...</p>
//       )}
//     </motion.div>
//   );
// };

// const RainAnimation = () => (
//   <motion.div
//     className="RainAnimation"
//     initial={{ y: -10 }}
//     animate={{ y: [0, 5, 0] }}
//     transition={{ duration: 0.3, repeat: Infinity }}
//   >
//     <WiRain />
//   </motion.div>
// );

// const ThunderstormAnimation = () => (
//   <motion.div
//     className="ThunderstormAnimation"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: [1, 0, 1] }}
//     transition={{ duration: 0.5, repeat: Infinity }}
//   >
//     <WiThunderstorm />
//   </motion.div>
// );

// const SnowAnimation = () => (
//   <motion.div
//     className="SnowAnimation"
//     initial={{ y: -10 }}
//     animate={{ y: [0, 5, 0] }}
//     transition={{ duration: 1, repeat: Infinity }}
//   >
//     <WiSnow />
//   </motion.div>
// );

// export default WeatherWidget;
// src/components/WeatherWidget.js
// src/components/WeatherWidget.js
import React, { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import { WiDaySunny, WiNightClear, WiCloudy } from "react-icons/wi";
import { motion } from "framer-motion";
import { GlobalStyle } from "../StyledComponents";
import { mockWeatherData, mockLocationData } from "./mockWeatherData";
import { useTheme } from "../ThemeContext";
import RainAnimation from "./RainAnimation";
import ThunderstormAnimation from "./ThunderstormAnimation";
import SnowAnimation from "./SnowAnimation";
import "./WeatherWidget.css";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const { theme, updateTheme } = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState({});

  const randomCity = useCallback(() => {
    const cities = Object.keys(mockWeatherData.locations);
    return cities[Math.floor(Math.random() * cities.length)];
  }, []);

  const fetchWeatherData = useCallback(() => {
    const city = randomCity();
    const weatherData = mockWeatherData.locations[city];

    if (!weatherData || !weatherData.current) {
      setError("Weather data not available for this location.");
      setWeather(null);
      return;
    }

    const { temp, weather: weatherInfo } = weatherData.current;
    const { description, icon } = weatherInfo[0];

    setWeather({
      temperature: temp,
      description,
      weatherIcon: icon,
    });

    updateCurrentDateTime(weatherData.timezone);
  }, [randomCity]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    if (weather) {
      const hour = new Date().getHours();
      updateTheme(weather.weatherIcon, hour);
    }
  }, [weather, updateTheme]);

  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString(DateTime.DATE_HUGE),
      time: now.toLocaleString(DateTime.TIME_SIMPLE),
    });
  };

  const getWeatherIcon = (weatherCode) => {
    switch (weatherCode) {
      case "01d":
        return <WiDaySunny />;
      case "01n":
        return <WiNightClear />;
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <WiCloudy />;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return <RainAnimation />;
      case "11d":
      case "11n":
        return <ThunderstormAnimation />;
      case "13d":
      case "13n":
        return <SnowAnimation />;
      default:
        return <WiCloudy />;
    }
  };

  return (
    <div
      style={{ background: theme.background, color: theme.color }}
      className="WeatherWidget"
    >
      <GlobalStyle />
      {error ? (
        <p className="Error">{error}</p>
      ) : weather ? (
        <motion.div
          className="WeatherWidget-Content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div className="CurrentTime">
            <p>{currentDateTime.time}</p>
          </motion.div>
          <motion.div className="Location">
            <p>{`${mockLocationData[city].city}, ${
              mockLocationData[city].state || ""
            }, ${mockLocationData[city].country}`}</p>
          </motion.div>
          <p>{currentDateTime.date}</p>
          <motion.div className="Temperature">
            <motion.div className="WeatherIcon">
              {getWeatherIcon(weather.weatherIcon)}
            </motion.div>
            <motion.div className="WeatherDescription">
              <p>
                {`${weather.temperature}°C`} <span>{weather.description}</span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default WeatherWidget;

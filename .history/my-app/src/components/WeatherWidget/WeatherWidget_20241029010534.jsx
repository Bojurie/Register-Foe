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
import {
  WiDaySunny,
  WiRain,
  WiSnow,
  WiCloudy,
  WiThunderstorm,
  WiNightClear,
} from "react-icons/wi";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import "./WeatherWidget.css";
import { GlobalStyle } from "../StyledComponents"; // Update this path as necessary
import { mockWeatherData, mockLocationData } from "./mockWeatherData";
import { useTheme } from "styled-components"; // Import useTheme from styled-components

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const { theme, updateTheme } = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState({});

  const randomCity = useCallback(() => {
    const cities = Object.keys(mockWeatherData.locations);
    return cities[Math.floor(Math.random() * cities.length)];
  }, []);

  const city = randomCity();

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    if (weather) {
      updateTheme(weather.weatherIcon); // Update theme based on the weather condition
    }
  }, [weather, updateTheme]);

  const fetchWeatherData = useCallback(() => {
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
  }, [city]);

  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString(DateTime.DATE_HUGE),
      time: now.toLocaleString(DateTime.TIME_SIMPLE),
    });
  };

  const getWeatherIcon = (weatherCode) => {
    const animationProps = {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1.1 },
      transition: { repeat: Infinity, duration: 2, repeatType: "mirror" },
    };

    switch (weatherCode) {
      case "01d":
        return (
          <motion.div {...animationProps}>
            <WiDaySunny />
          </motion.div>
        );
      case "01n":
        return (
          <motion.div {...animationProps}>
            <WiNightClear />
          </motion.div>
        );
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return (
          <motion.div {...animationProps}>
            <WiCloudy />
          </motion.div>
        );
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
        return (
          <motion.div {...animationProps}>
            <WiCloudy />
          </motion.div>
        );
    }
  };

  const isDayTime = () => {
    const hour = DateTime.now().hour;
    return hour >= 6 && hour < 18; // Daytime from 6 AM to 6 PM
  };

  const backgroundAnimation = useSpring({
    backgroundColor: isDayTime() ? "#87CEEB" : "#2C3E50", // Sky blue for daytime, dark blue for night
    config: { duration: 500 },
  });

  return (
    <>
      <GlobalStyle theme={theme} />

      <animated.div className="WeatherWidget" style={backgroundAnimation}>
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
              <p>
                {`${mockLocationData[city].city}, ${
                  mockLocationData[city].state || ""
                }, ${mockLocationData[city].country}`}
              </p>
            </motion.div>
            <p>{currentDateTime.date}</p>
            <motion.div className="Temperature">
              <motion.div className="WeatherIcon">
                {getWeatherIcon(weather.weatherIcon)}
              </motion.div>
              <motion.div className="WeatherDescription">
                <p>
                  {`${weather.temperature}°C`}{" "}
                  <span>{weather.description}</span>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <p>Loading weather...</p>
        )}
        {isDayTime() ? <DaytimeBackground /> : <NighttimeBackground />}
      </animated.div>
    </>
  );
};

const RainAnimation = () => (
  <motion.div
    className="RainAnimation"
    initial={{ y: -10 }}
    animate={{ y: [0, 5, -5] }}
    transition={{ duration: 0.5, repeat: Infinity }}
  >
    <WiRain className="RainIcon" />
    <Droplets />
  </motion.div>
);

const ThunderstormAnimation = () => (
  <motion.div
    className="ThunderstormAnimation"
    initial={{ opacity: 0 }}
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.5, repeat: Infinity }}
  >
    <WiThunderstorm />
  </motion.div>
);

const SnowAnimation = () => (
  <motion.div
    className="SnowAnimation"
    initial={{ y: -10 }}
    animate={{ y: [0, 5, -5] }}
    transition={{ duration: 0.5, repeat: Infinity }}
  >
    <WiSnow className="SnowIcon" />
    <Snowflakes />
  </motion.div>
);

const Droplets = () => (
  <>
    {[...Array(10)].map((_, index) => (
      <motion.div
        key={index}
        className="Droplet"
        initial={{ opacity: 1, y: -20 }}
        animate={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, repeat: Infinity, delay: index * 0.1 }}
      />
    ))}
  </>
);

const Snowflakes = () => (
  <>
    {[...Array(10)].map((_, index) => (
      <motion.div
        key={index}
        className="Snowflake"
        initial={{ opacity: 1, y: -20 }}
        animate={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.1 }}
      />
    ))}
  </>
);

// Daytime background component
const DaytimeBackground = () => (
  <div className="DaytimeBackground">
    <div className="Sun"></div>
  </div>
);

// Nighttime background component
const NighttimeBackground = () => (
  <div className="NighttimeBackground">
    <div className="Moon"></div>
    <div className="Stars">
      {[...Array(50)].map((_, index) => (
        <div key={index} className="Star"></div>
      ))}
    </div>
  </div>
);

export default WeatherWidget;

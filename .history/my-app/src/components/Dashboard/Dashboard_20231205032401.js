// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./Dashboard.css"; // Import your CSS file
// import { motion } from "framer-motion";


// const Dashboard = () => {
//   const [currentTime, setCurrentTime] = useState("");
//   const [currentLocation, setCurrentLocation] = useState("");
//   const [weather, setWeather] = useState("");
//   const [userInput, setUserInput] = useState("");
//   const [elections, setElections] = useState([]);
//   const [filteredElections, setFilteredElections] = useState([]);

//   useEffect(() => {
//     // Fetch current time
//     const timeInterval = setInterval(() => {
//       const now = new Date();
//       setCurrentTime(now.toLocaleTimeString());
//     }, 1000);

//     // Fetch current location
//     const locationOptions = {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     };

//     const locationSuccess = (position) => {
//       const { latitude, longitude } = position.coords;
//       setCurrentLocation(`Lat: ${latitude}, Long: ${longitude}`);
//     };

//     const locationError = (error) => {
//       console.error("Error getting location:", error.message);
//       setCurrentLocation("Location not available");
//     };

//     navigator.geolocation.getCurrentPosition(
//       locationSuccess,
//       locationError,
//       locationOptions
//     );

//     // Cleanup intervals
//     return () => {
//       clearInterval(timeInterval);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchWeather = async () => {
//       try {
//         const response = await axios.get(
//           `http://api.openweathermap.org/data/2.5/weather?lat=37.7749&lon=-122.4194&appid=YOUR_OPENWEATHERMAP_API_KEY`
//         );
//         setWeather(response.data.weather[0].description);
//       } catch (error) {
//         console.error("Error fetching weather:", error.response.data);
//       }
//     };

//     fetchWeather();
//   }, []);

//   const handleInputChange = (e) => {
//     setUserInput(e.target.value);
//   };

//   const handleFilter = () => {
//     // Filter elections based on user input (replace with your API endpoint)
//     const filtered = elections.filter(
//       (election) =>
//         election.state.toLowerCase().includes(userInput.toLowerCase()) ||
//         election.city.toLowerCase().includes(userInput.toLowerCase()) ||
//         election.zipcode.toLowerCase().includes(userInput.toLowerCase())
//     );
//     setFilteredElections(filtered);
//   };

//   // Fetch upcoming elections from FEC API (replace with your API endpoint)
//   useEffect(() => {
//     const fetchElections = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/election");
//         setElections(response.data);
//       } catch (error) {
//         console.error("Error fetching elections:", error.response.data);
//       }
//     };

//     fetchElections();
//   }, []);

//   return (
//     <motion.div
//       className="dashboard-container"
//       initial={{ opacity: 0, x: -50 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1>Welcome to Your Dashboard</h1>
//       <motion.p
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         Current Time: {currentTime}
//       </motion.p>
//       <motion.p
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//       >
//         Current Location: {currentLocation}
//       </motion.p>
//       <motion.p
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.6 }}
//       >
//         Weather: {weather}
//       </motion.p>

//       <motion.div
//         className="search-container"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.8 }}
//       >
//         <label htmlFor="userInput">Enter State, City, or Zip Code:</label>
//         <input
//           type="text"
//           id="userInput"
//           value={userInput}
//           onChange={handleInputChange}
//         />
//         <motion.button
//           onClick={handleFilter}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           Search
//         </motion.button>
//       </motion.div>

//       <motion.ul
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 1 }}
//       >
//         {filteredElections.length > 0 ? (
//           filteredElections.map((election) => (
//             <motion.li key={election.id} whileHover={{ scale: 1.05 }}>
//               <strong>State:</strong> {election.state}, <strong>Date:</strong>{" "}
//               {election.date}, <strong>Type:</strong> {election.type},{" "}
//               <strong>Candidate:</strong> {election.candidate}
//             </motion.li>
//           ))
//         ) : (
//           <p>No elections found.</p>
//         )}
//       </motion.ul>
//     </motion.div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WeatherWidget from '../WeatherWidget/WeatherWidget';
import ElectionsWidget from '../ElectionsWidget/ElectionsWidget';
import SearchBar from '../SearchBar/SearchBar';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState({});

  const getUserLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Assume you have a function to reverse geocode coordinates to get city and state
      const locationData = await reverseGeocode(latitude, longitude);

      return {
        city: locationData.city,
        state: locationData.state,
      };
    } catch (error) {
      console.error("Error getting user location:", error.message);
      return {
        city: "Unknown",
        state: "Unknown",
      };
    }
  };

  // Helper function to get current position
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  // Helper function to reverse geocode coordinates
  const reverseGeocode = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=YOUR_API_KEY`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { name: city, state } = data[0];
      return { city, state };
    } else {
      return { city: "Unknown", state: "Unknown" };
    }
  };
  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })
    );
    setCurrentLocation(getUserLocation());
  }, []);

    const handleLogout = () => {
      // Add logic to perform logout (clear authentication, redirect, etc.)
      console.log("Logout successful");
    };
    
  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1>Welcome to Your Dashboard</h1>
      <p>Current Time: {currentTime}</p>
      <p>
        Current Location: {currentLocation.city}, {currentLocation.state}
      </p>

      {/* Weather Widget Component */}
      <WeatherWidget city={currentLocation.city} />

      {/* Upcoming Elections Widget Component */}
      <ElectionsWidget />

      {/* Search Bar Component */}
      <SearchBar />
      <button onClick={handleLogout}>Logout</button>
    </motion.div>
  );
};

export default Dashboard;

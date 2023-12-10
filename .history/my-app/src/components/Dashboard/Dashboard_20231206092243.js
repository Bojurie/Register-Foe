// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import WeatherWidget from "../WeatherWidget/WeatherWidget";
// import ElectionsWidget from "../ElectionsWidget/ElectionsWidget";
// import SearchBar from "../SearchBar/SearchBar";
// import { useAuth } from "../AuthContext/AuthContext"

// // import * as THREE from "three"

// const Dashboard = () => {
//     const { user, logout } = useAuth();
//   const [currentTime, setCurrentTime] = useState("");
//   const [currentLocation, setCurrentLocation] = useState({});
//   const [cubeRotation, setCubeRotation] = useState(0);

//   const getUserLocation = async () => {
//     try {
//       const position = await getCurrentPosition();
//       const { latitude, longitude } = position.coords;
//       const locationData = await reverseGeocode(latitude, longitude);
//       return {
//         city: locationData.city,
//         state: locationData.state,
//       };
//     } catch (error) {
//       console.error("Error getting user location:", error.message);
//       return {
//         city: "Unknown",
//         state: "Unknown",
//       };
//     }
//   };

//   const getCurrentPosition = () => {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(resolve, reject);
//     });
//   };

//   const reverseGeocode = async (latitude, longitude) => {
//     const response = await fetch(
//       `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=$AIzaSyCzujcMgt2TgzNetiqPcFvteocc1MhKaf4`
//     );
//     const data = await response.json();

//     if (data.length > 0) {
//       const { name: city, state } = data[0];
//       return { city, state };
//     } else {
//       return { city: "Unknown", state: "Unknown" };
//     }
//   };

//   useEffect(() => {
//     const fetchLocation = async () => {
//       const location = await getUserLocation();
//       setCurrentLocation(location);
//     };

//     setCurrentTime(
//       new Date().toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "numeric",
//         second: "numeric",
//       })
//     );
//     fetchLocation();

//     // Rotate the cube every second
//     const interval = setInterval(() => {
//       setCubeRotation((prevRotation) => prevRotation + Math.PI / 2);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <motion.div
//       className="Dashboard"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1.5 }}
//     >
//       <h1>Welcome, {user ? user.FirstName : "Guest"}!</h1>
//       <p>Current Time: {currentTime}</p>
//       <p>
//         Current Location: {currentLocation.city || "Unknown"},{" "}
//         {currentLocation.state || "Unknown"}
//       </p>

//       <WeatherWidget city={currentLocation.city} />
//       <ElectionsWidget />
//       <SearchBar />
//       <motion.div
//         style={{
//           width: "100px",
//           height: "100px",
//           position: "relative",
//         }}
//       >
//         <canvas id="cube-canvas" />
//         <motion.div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             rotate: cubeRotation,
//             originX: 0.5,
//             originY: 0.5,
//             width: "60px",
//             height: "60px",
//             backgroundColor: "#3498db",
//           }}
//         />
//       </motion.div>

//       {/* Logout Button */}
//       <button onClick={logout}>Logout</button>
//     </motion.div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import ElectionsWidget from "../ElectionsWidget/ElectionsWidget";
import SearchBar from "../SearchBar/SearchBar";
import * as THREE from "three";
import "./Dashboard.css"
import CityScene from "../CityScean/CityScean";
import { useAuth } from "../AuthContext/AuthContext";
import LogoutButton from "../LogoutButton";

const Dashboard = ({ user, currentTime, currentLocation, logout }) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  const cubeRotation = useRef(0);

  useEffect(() => {
    // Set up Three.js scene
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("cube-canvas").appendChild(renderer.domElement);

    // Create cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Set up camera position
    camera.position.z = 5;

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      document.getElementById("cube-canvas").removeChild(renderer.domElement);
    };
  }, []);

  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1>Welcome, {user ? user.FirstName : "Guest"}!</h1>
      <p>Current Time: {currentTime}</p>
      <p>
        Current Location: {currentLocation?.city || "Unknown"},{" "}
        {currentLocation?.state || "Unknown"}
      </p>

      {/* Weather Widget */}
      {currentLocation && <WeatherWidget city={currentLocation.city} />}

      <ElectionsWidget />
      <SearchBar />

      {/* Logout Button */}
      <LogoutButton />

      {/* 3D Cube Canvas */}
      <div id="cube-canvas" style={{ width: "100vw", height: "100vh" }} />

      <CityScene />
    </motion.div>
  );
};

export default Dashboard;
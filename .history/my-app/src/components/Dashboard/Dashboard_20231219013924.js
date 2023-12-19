import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import ElectionsWidget from "../ElectionsWidget/ElectionsWidget";
import SearchBar from "../SearchBar/SearchBar";
import * as THREE from "three";
import "./Dashboard.css";
import LogoutButton from "../LogoutButton";
import { useAuth } from "../AuthContext/AuthContext";

const Dashboard = ({  currentTime, currentLocation, currentWeather }) => {
  const { user } = useAuth();
    console.log("User in Dashboard:", user);

  const cubeCanvasRef = useRef();
  const [scene, setScene] = useState(new THREE.Scene());
  const [camera] = useState(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const [renderer] = useState(new THREE.WebGLRenderer());

  const setupThreeJS = () => {
    const cubeCanvas = cubeCanvasRef.current;

    renderer.setSize(window.innerWidth, window.innerHeight);
    cubeCanvas.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db });
    const cube = new THREE.Mesh(geometry, material);
    setScene((prevScene) => {
      prevScene.add(cube);
      return prevScene;
    });

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  };

  useEffect(() => {
    setupThreeJS();

    return () => {
      renderer.domElement.remove();
      scene.remove(scene.children[0]);
    };
  }, []);

  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
     <h1>Welcome, {user ? user.firstName + user.lastName : "Guest"}!</h1>
      <p>Current Time: {currentTime}</p>
      <p>
        Current Location: {currentLocation?.city || "Unknown"},{" "}
        {currentLocation?.state || "Unknown"}
      </p>
      <WeatherWidget
        city={currentLocation?.city}
        currentWeather={currentWeather}
      />
      <ElectionsWidget />
      <SearchBar />
      <LogoutButton />
      <div ref={cubeCanvasRef} style={{ width: "100vw", height: "100vh" }} />
    </motion.div>
  );
};

export default Dashboard;

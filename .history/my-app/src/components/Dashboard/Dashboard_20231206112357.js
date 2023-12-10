import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import ElectionsWidget from "../ElectionsWidget/ElectionsWidget";
import SearchBar from "../SearchBar/SearchBar";
import * as THREE from "three";
import "./Dashboard.css";
import CityScene from "../CityScean/CityScean";
import LogoutButton from "../LogoutButton";

const Dashboard = ({ user, currentTime, currentLocation }) => {
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

    // Set up Three.js scene
    renderer.setSize(window.innerWidth, window.innerHeight);
    cubeCanvas.appendChild(renderer.domElement);

    // Create cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db });
    const cube = new THREE.Mesh(geometry, material);
    setScene((prevScene) => {
      prevScene.add(cube);
      return prevScene;
    });

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
  };

  useEffect(() => {
    setupThreeJS();

    // Cleanup Three.js resources
    return () => {
      renderer.domElement.remove();
      scene.remove(scene.children[0]); // Remove the cube
    };
  }, []);

  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1>Welcome, {user ? user.firstName : "Guest"}!</h1>
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
      <div ref={cubeCanvasRef} style={{ width: "100vw", height: "100vh" }} />

      {/* <CityScene /> */}
    </motion.div>
  );
};

export default Dashboard;

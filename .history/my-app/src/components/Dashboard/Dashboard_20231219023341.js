import React from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import ElectionsWidget from "../ElectionsWidget/ElectionsWidget";
import SearchBar from "../SearchBar/SearchBar";
import "./Dashboard.css";
import LogoutButton from "../LogoutButton";

  
const Dashboard = ({ user }) => {
  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!</h1>
      <WeatherWidget />
       <ElectionsWidget />
      <SearchBar />
      <LogoutButton />
            <div ref={cubeCanvasRef} style={{ width: "100vw", height: "100vh" }} />

    </motion.div>
  );
};

export default Dashboard;


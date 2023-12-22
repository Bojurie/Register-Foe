import React from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
// import ElectionsWidget from "../ElectionsWidget/ElectionsWidget";
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
      <WeatherWidget user={user} />
      {/* <ElectionsWidget /> */}
      <SearchBar />
      <LogoutButton />
    </motion.div>
  );
};

export default Dashboard;

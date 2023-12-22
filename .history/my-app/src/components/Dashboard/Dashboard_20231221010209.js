import React from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import SearchBar from "../SearchBar/SearchBar";
import LogoutButton from "../LogoutButton";
import ElectionList from "../ElectionList /ElectionList";
import SavedElections from "../SavedElections/SavedElections"; // Import SavedElections component
import PastElectionList from "../PastElectionList/PastElectionList"; // Import PastElectionList component


import "./Dashboard.css";

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
      <div className="Middle-Dashboard">
        <PastElectionList />
        <SearchBar />
        <SavedElections />
      </div>
      <LogoutButton />
    </motion.div>
  );
};

export default Dashboard;

import React from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import PastElectionList from "../PastElectionList/PastElectionList";
import ElectionList from "../ElectionList /ElectionList";
import "./CompanyDashboard.css";


function CompanyDashboard() {
  return (
    <div>
      <motion.div
        className="Dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1>
          Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!
        </h1>
        <WeatherWidget user={user} />
        <div className="Middle-Dashboard">
          <PastElectionList userId={user?._id} />
          
        </div>
        <ElectionList elections={upcomingElections} userId={user?._id} />
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;
import React, {useState, useEffect}from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import SearchBar from "../SearchBar/SearchBar";
import SavedElections from "../SavedElections/SavedElections"; 
import PastElectionList from "../PastElectionList/PastElectionList"; 
import ElectionList from "../ElectionList /ElectionList";


const Dashboard = ({ user }) => {
  const [upcomingElections, setUpcomingElections] = useState([]);

  const handleElectionsFetched = (elections) => {
    setUpcomingElections(elections);
  };

  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div>
        <h1>
          Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!
        </h1>
        <WeatherWidget user={user} />
        <div className="Middle-Dashboard">
          <PastElectionList />
          <SearchBar onElectionsFetched={handleElectionsFetched} />
          <SavedElections />
        </div>
        <div className="ElectionsComponent">
          <ElectionList elections={upcomingElections} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

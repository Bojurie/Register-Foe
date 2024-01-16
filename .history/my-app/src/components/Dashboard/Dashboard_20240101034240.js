import React, {useState}from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import SearchBar from "../SearchBar/SearchBar";
import SavedElections from "../SavedElections/SavedElections"; 
import PastElectionList from "../PastElectionList/PastElectionList"; 
import ElectionList from "../ElectionList /ElectionList";
import './Dashboard.css'
import TopicWidget from "../TopicWidget/TopicWidget";

const Dashboard = ({ user }) => {
  const [upcomingElections, setUpcomingElections] = useState([]);


  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <SearchBar onElectionsFetched={setUpcomingElections} />

      <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!</h1>
      <WeatherWidget user={user} />
      <div className="Middle-Dashboard">
      <div>
         <PastElectionList userId={user?._id} />
      </div>
       <div>
        <ElectionList elections={upcomingElections} userId={user?._id} />
       </div>
         <div>
          <SavedElections userId={user?._id} />
          <TopicWidget />
         </div>
        
      </div>
     
    </motion.div>
  );
};

export default Dashboard;

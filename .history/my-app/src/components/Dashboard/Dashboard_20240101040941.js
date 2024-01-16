import React, {useState, useEffect}from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import SearchBar from "../SearchBar/SearchBar";
import SavedElections from "../SavedElections/SavedElections"; 
import PastElectionList from "../PastElectionList/PastElectionList"; 
import ElectionList from "../ElectionList /ElectionList";
import './Dashboard.css'
import TopicWidget from "../TopicWidget/TopicWidget";
import { useAuth } from "../AuthContext/AuthContext";

const Dashboard = () => {
  const [upcomingElections, setUpcomingElections] = useState([]);
    const [topics, setTopics] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
  const {
    user,
    fetchTopicsByCompanyCode,
  } = useAuth();
useEffect(() => {
  const fetchTopics = async () => {
    if (user && user.isCompany && user.companyCode) {
      const topicResponse = await fetchTopicsByCompanyCode(user.companyCode);
      console.log("Topic Response in CompanyDashboard:", topicResponse);
      setTopics(topicResponse); // Make sure this updates the state
    } else {
      console.log("User or company code not available");
      setIsLoading(false);
    }
  };

  fetchTopics();
}, [user, fetchTopicsByCompanyCode]);
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
          <TopicWidget topics={topics} />
         </div>
        
      </div>
     
    </motion.div>
  );
};

export default Dashboard;

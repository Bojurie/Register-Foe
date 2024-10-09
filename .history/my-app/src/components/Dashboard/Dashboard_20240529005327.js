import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import PastElectionList from "../PastElectionList/PastElectionList";
import "./Dashboard.css";
import ElectionList from "../ElectionList /ElectionList";
import TopicWidget from "../TopicWidget/TopicWidget";
import NewsWidget from "../CompanyNews/NewsWidget";
import CalenderWidget from "../Calendar/CalenderWidget";

const Dashboard = () => {
  const {
    user,
    fetchPastElection,
    getElections,
    fetchTopicsByCompanyCode,
    getCompanyNews,
  } = useAuth();
  const [pastElections, setPastElections] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [upcomingNews, setUpcomingNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) throw new Error("User not authenticated");
        setIsLoading(true);
        const fetchedPastElections = await fetchPastElection(user.companyCode);
        const fetchedUpcomingElections = await getElections(user.companyCode);
        const fetchedTopics = await fetchTopicsByCompanyCode(user.companyCode);
        const fetchedNews = await getCompanyNews(user.companyCode);

        setPastElections(fetchedPastElections);
        setUpcomingElections(fetchedUpcomingElections);
        setTopics(fetchedTopics);
        setUpcomingNews(fetchedNews);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to fetch dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    user,
    fetchPastElection,
    getElections,
    fetchTopicsByCompanyCode,
    getCompanyNews,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="Dashboard-header">
        <h1>
          Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!
        </h1>
        <WeatherWidget user={user} />
      </div>
      <div className="Dashboard-Main">
        <div className="Dashboard-Main-Content">
          <div className="Dashboard-Left">
            <CalenderWidget />
          </div>
          <div>
            <PastElectionList pastElections={pastElections} />
          </div>
          <div className="Dashboard-Middle">
            <ElectionList elections={upcomingElections} />
          </div>

          <div className="Dashboard-content">
            <TopicWidget topics={topics} />
            <NewsWidget news={upcomingNews} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
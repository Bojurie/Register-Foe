import React, { useState, useEffect } from "react";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
import { fetchTopicsByCompanyCode } from "../AuthContext/AuthContext";

const Topic = ({ companyCode }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopicsByCompanyCode(companyCode);
        setTopics(fetchedTopics);
      } catch (error) {
        console.error("Failed to load topics:", error);
        // Optionally, handle user feedback for error here
      }
    };

    loadTopics();
  }, [companyCode]);

  return <TopicDisplay topics={topics} />;
};

export default Topic;

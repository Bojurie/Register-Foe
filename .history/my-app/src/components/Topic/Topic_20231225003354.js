import React, { useState, useEffect } from "react";
import TopicDisplay from "./TopicsDisplayComponent";
import { fetchTopicsByCompanyCode } from "./services"; // import the fetch function

const Topic = ({ companyCode }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopicsByCompanyCode(companyCode);
        setTopics(fetchedTopics);
      } catch (error) {
        console.error("Failed to load topics:", error);
      }
    };

    loadTopics();
  }, [companyCode]);

  return <TopicDisplay topics={topics} />;
};

export default Topic;

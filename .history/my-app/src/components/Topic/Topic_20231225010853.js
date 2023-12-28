import React, { useState, useEffect } from "react";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
import { GetTopicsByCode } from "../AuthAPI/AuthAPI"; // Corrected import

const Topic = ({ companyCode }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const fetchedTopics = await GetTopicsByCode(companyCode);
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

import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import "./NewsWidget.css";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance";

const NewsWidget = ({ news: initialNews = [] }) => {
  const { enqueueSnackbar, updateReadNewNews, user } = useAuth();
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [updatedNews, setUpdatedNews] = useState(initialNews);
  const [loading, setLoading] = useState(false);

  // Update the news whenever initial news data changes
  useEffect(() => {
    setUpdatedNews(initialNews);
  }, [initialNews]);

  // Handle clicking on a news item
  const handleNewsClick = async (newsItem) => {
    setSelectedNewsItem(newsItem);
    setIsModalOpen(true);

    if (newsItem.isNew) {
      try {
        const userId = user._id;
        await updateReadNewNews(newsItem._id, userId, enqueueSnackbar);

        setLoading(true);
        const { data } = await axiosInstance.get(
          `/news/byCompanyCode/${user.companyCode}`
        );
        setUpdatedNews(data.news);
        setLoading(false);
      } catch (error) {
        console.error("Error marking news as read:", error);
        enqueueSnackbar("Error marking news as read.", { variant: "error" });
        setLoading(false);
      }
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNewsItem(null);
  };

  return (
    <motion.div className="NewsWidget-Wrapper">
      <h2
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="NewsWidget-Header"
      >
        {isCollapsed ? "Company News (Show)" : "Company News (Hide)"}
      </h2>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div className="news-widget">
            <div className="news-widget-content">
              {loading ? (
                <p>Loading news...</p>
              ) : updatedNews.length > 0 ? (
                updatedNews.map((newsItem) => (
                  <motion.div key={newsItem._id}>
                    <NewsItem
                      newsItem={newsItem}
                      onClick={() => handleNewsClick(newsItem)}
                    />
                  </motion.div>
                ))
              ) : (
                <p>No news available.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isModalOpen && (
        <NewsModal
          newsItem={selectedNewsItem}
          onClose={handleCloseModal}
          isFullScreen
        />
      )}
    </motion.div>
  );
};

export default NewsWidget;

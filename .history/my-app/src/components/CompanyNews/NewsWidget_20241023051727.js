import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance";
import "./NewsWidget.css";

const NewsWidget = ({ news: { news = [] } = {} }) => {
  const { enqueueSnackbar, markAsReadNews, user } = useAuth();
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [updatedNews, setUpdatedNews] = useState([]); // Set initial empty array
  const [loading, setLoading] = useState(false);

  // Effect to update news when `news` prop changes
  useEffect(() => {
    if (Array.isArray(news)) {
      setUpdatedNews(news); // Ensure it's an array
    }
  }, [news]);

  // Handle news item click
  const handleNewsClick = async (newsItem) => {
    setSelectedNewsItem(newsItem);
    setIsModalOpen(true);

    if (newsItem.isNew) {
      try {
        setLoading(true);
        const response = await markAsReadNews(
          newsItem._id,
          user._id,
          enqueueSnackbar
        );

        if (response && response.newsItem) {
          const updatedNewsList = updatedNews.map((item) =>
            item._id === newsItem._id ? { ...item, isNew: false } : item
          );
          setUpdatedNews(updatedNewsList);
        }

        // Fetch latest news after updating
        const updatedNewsResponse = await axiosInstance.get(
          `/news/byCompanyCode/${user.companyCode}`
        );
        setUpdatedNews(updatedNewsResponse.data.news || []);
      } catch (error) {
        enqueueSnackbar("Error marking news as read.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNewsItem(null); // Reset selected item when modal is closed
  };

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <motion.div className="NewsWidget-Wrapper">
      <h2 onClick={toggleCollapse} className="NewsWidget-Header sticky-header">
        {isCollapsed ? "Show Company News" : "Hide Company News"}
      </h2>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="news-widget"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
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

      {isModalOpen && selectedNewsItem && (
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

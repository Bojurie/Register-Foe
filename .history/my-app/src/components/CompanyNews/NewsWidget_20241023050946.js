import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance";
import "./NewsWidget.css";

const NewsWidget = ({ news = [] }) => {
  const { enqueueSnackbar, markAsReadNews, user } = useAuth();
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [updatedNews, setUpdatedNews] = useState(news); // Initialize with the passed prop
  const [loading, setLoading] = useState(false);

  // Sync `updatedNews` with the `news` prop only when it changes
  useEffect(() => {
    setUpdatedNews(news);
  }, [news]);

  // Handler for when a news item is clicked
  const handleNewsClick = useCallback(
    async (newsItem) => {
      setSelectedNewsItem(newsItem);
      setIsModalOpen(true);

      if (newsItem.isNew) {
        try {
          setLoading(true);
          console.log(`Marking news item ${newsItem._id} as read...`);

          // Mark news as read
          const response = await markAsReadNews(
            newsItem._id,
            user._id,
            enqueueSnackbar
          );

          // If the marking was successful, update the local news state
          if (response && response.success) {
            console.log(`News item ${newsItem._id} marked as read.`);
            setUpdatedNews((prevNews) =>
              prevNews.map((item) =>
                item._id === newsItem._id ? { ...item, isNew: false } : item
              )
            );
          } else {
            console.error("Failed to update news state.");
          }
        } catch (error) {
          enqueueSnackbar("Error marking news as read.", { variant: "error" });
        } finally {
          setLoading(false);
        }
      }
    },
    [markAsReadNews, user._id, enqueueSnackbar]
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNewsItem(null);
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

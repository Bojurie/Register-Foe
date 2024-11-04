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
  const [updatedNews, setUpdatedNews] = useState(news || []); // Ensure fallback to empty array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdatedNews(news || []); // Fallback to empty array
  }, [news]);

  const handleNewsClick = async (newsItem) => {
    setSelectedNewsItem(newsItem);
    setIsModalOpen(true);

    if (newsItem.isNew) {
      try {
        setLoading(true); // Start loading when marking news as read
        console.log(`Marking news item ${newsItem._id} as read...`);

        const response = await markAsReadNews(
          newsItem._id,
          user._id,
          enqueueSnackbar
        );

        if (response && response.newsItem) {
          console.log(`Updated news item from server:`, response.newsItem);

          const updatedNewsList = updatedNews.map((item) => {
            if (item._id === newsItem._id) {
              return { ...item, isNew: false }; // Mark as read
            }
            return item;
          });

          setUpdatedNews(updatedNewsList); // Update state with the modified list
        } else {
          console.error("No news item returned in the response.");
        }

        // Fetch updated read news from server
        const updatedNewsResponse = await axiosInstance.get(
          `/news/byCompanyCode/${user.companyCode}`
        );
        setUpdatedNews(updatedNewsResponse.data.news || []); // Ensure fallback to empty array
      } catch (error) {
        enqueueSnackbar("Error marking news as read.", { variant: "error" });
      } finally {
        setLoading(false); // Stop loading once the operation is complete
      }
    }
  };

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

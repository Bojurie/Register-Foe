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
  const [updatedNews, setUpdatedNews] = useState(news);
  const [loading, setLoading] = useState(false);

  // Ensure updated news from props is reflected in state
  useEffect(() => {
    setUpdatedNews(news);
  }, [news]);

  // Handle clicking on a news item
  const handleNewsClick = async (newsItem) => {
    setSelectedNewsItem(newsItem);
    setIsModalOpen(true);

    if (newsItem.isNew) {
      try {
        setLoading(true); // Start loading when marking news as read
        console.log(`Marking news item ${newsItem._id} as read...`);

        // Call the function to mark as read
        await markAsReadNews(newsItem._id, user._id, enqueueSnackbar);

        // Log after marking as read
        console.log(`News item ${newsItem._id} marked as read.`);

        // Fetch updated read news from server
        const updatedNewsResponse = await axiosInstance.get(
         `/news/news/byCompanyCode/${user.companyCode}`
        );
        setUpdatedNews(updatedNewsResponse.data.news); // Update state with the latest news
      } catch (error) {
        enqueueSnackbar("Error marking news as read.", { variant: "error" });
      } finally {
        setLoading(false); // Stop loading once the operation is complete
      }
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNewsItem(null);
  };

  // Toggle collapsing and expanding the news widget
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

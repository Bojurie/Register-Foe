import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import "./NewsWidget.css";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";

const NewsWidget = ({ news = [] }) => {
  const { enqueueSnackbar, updateReadNewNews, user } = useAuth();
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [updatedNews, setUpdatedNews] = useState(news); // Initial news state

  // Function to fetch the updated news from the server
  const fetchUpdatedNews = async () => {
    try {
      // Assuming we have an API to fetch the updated news after some are marked as read
      const updatedNewsResponse = await axiosInstance.get(
        `/news/companyCode/${user.companyCode}`
      );
      setUpdatedNews(updatedNewsResponse.data); // Update the news state with fresh data
    } catch (error) {
      console.error("Error fetching updated news:", error);
      enqueueSnackbar("Error fetching updated news. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleNewsClick = async (newsItem) => {
    setSelectedNewsItem(newsItem); // Set selected news item for modal display
    setIsModalOpen(true); // Open the modal

    // Check if the news item is new, and if so, mark it as read
    if (newsItem.isNew) {
      try {
        const userId = user._id;
        await updateReadNewNews(newsItem._id, userId, enqueueSnackbar);
        await fetchUpdatedNews(); // Fetch updated news after marking as read
      } catch (error) {
        console.error("Error marking news as read:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNewsItem(null);
  };

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Animation container for showing and hiding news items
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="NewsWidget-Wrapper">
      <h2 onClick={toggleCollapse} className="NewsWidget-Header">
        {isCollapsed ? "Company News (Show)" : "Company News (Hide)"}
      </h2>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="news-widget"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            <div className="news-widget-content">
              {updatedNews.length > 0 ? (
                updatedNews.map((newsItem, index) => (
                  <motion.div key={index} variants={itemVariants}>
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

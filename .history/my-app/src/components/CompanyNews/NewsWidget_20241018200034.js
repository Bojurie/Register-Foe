import React, { useState, useEffect, useCallback, useMemo } from "react";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import "./NewsWidget.css";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance";
import CircularProgress from "@mui/material/CircularProgress"; // MUI loader

const NewsWidget = ({ news: initialNews = [] }) => {
  const { enqueueSnackbar, updateReadNewNews, user } = useAuth();
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [updatedNews, setUpdatedNews] = useState(initialNews);
  const [loading, setLoading] = useState(false);

  // Update the state whenever the incoming news prop changes
  useEffect(() => {
    setUpdatedNews(initialNews);
  }, [initialNews]);

  // Fetch latest news and mark as read if necessary
  const handleNewsClick = useCallback(
    async (newsItem) => {
      setSelectedNewsItem(newsItem);
      setIsModalOpen(true);

      if (newsItem.isNew) {
        try {
          const userId = user._id;
          await updateReadNewNews(newsItem._id, userId, enqueueSnackbar);

          setLoading(true);
          const updatedNewsResponse = await axiosInstance.get(
            `/news/byCompanyCode/${user.companyCode}`
          );
          setUpdatedNews(updatedNewsResponse.data.news);
          setLoading(false);
        } catch (error) {
          console.error("Error marking news as read:", error);
          enqueueSnackbar("Error marking news as read.", { variant: "error" });
          setLoading(false);
        }
      }
    },
    [enqueueSnackbar, updateReadNewNews, user]
  );

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNewsItem(null);
  };

  // Memoized News Items for performance
  const renderedNews = useMemo(() => {
    if (loading) {
      return (
        <div className="NewsWidget-Loading">
          <CircularProgress />
        </div>
      );
    }

    if (updatedNews.length > 0) {
      return updatedNews.map((newsItem) => (
        <motion.div key={newsItem._id}>
          <NewsItem
            newsItem={newsItem}
            onClick={() => handleNewsClick(newsItem)}
          />
        </motion.div>
      ));
    }

    return <p>No news available.</p>;
  }, [updatedNews, loading, handleNewsClick]);

  return (
    <motion.div className="NewsWidget-Wrapper">
      <h2
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="NewsWidget-Header"
        aria-expanded={!isCollapsed}
        aria-controls="news-widget-content"
      >
        {isCollapsed ? "Company News (Show)" : "Company News (Hide)"}
      </h2>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="news-widget"
            id="news-widget-content"
            aria-live="polite"
          >
            <div className="news-widget-content">{renderedNews}</div>
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

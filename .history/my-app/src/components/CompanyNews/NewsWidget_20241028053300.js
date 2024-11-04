import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance";
import "./NewsWidget.css";

const NewsWidget = ({ news }) => {
  const { markAsReadNews, user } = useAuth();
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [updatedNews, setUpdatedNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (news && Array.isArray(news.news)) {
      setUpdatedNews(news.news);
      console.log("[INFO] Initial news items loaded:", news.news);
    }
  }, [news]);

  const fetchLatestNews = async () => {
    try {
      console.log("[INFO] Fetching latest news for company:", user.companyCode);
      const { data } = await axiosInstance.get(
        `/news/byCompanyCode/${user.companyCode}`
      );
      setUpdatedNews(data.news || []);
      console.log("[INFO] Latest news fetched successfully:", data.news);
    } catch (error) {
      console.error("[ERROR] Error fetching updated news:", error.message);
      setMessage({
        type: "error",
        text: "Failed to fetch updated news. Please try again.",
      });
    }
  };

const handleNewsClick = async (newsItem) => {
  console.log("[INFO] News item clicked:", newsItem);

  setSelectedNewsItem(newsItem);
  setIsModalOpen(true);

  if (newsItem.isNew) {
    try {
      setLoading(true);
      console.log("[INFO] Marking news item as read:", newsItem._id);

      const response = await markAsReadNews(newsItem._id);
      if (response?.success) {
        console.log("[INFO] News item marked as read:", response.data);
        setMessage({ type: "success", text: "News marked as read!" });

        // Fetch latest news after marking as read to update the UI state
        await fetchLatestNews();
      } else {
        setMessage({
          type: "warning",
          text: "Failed to update read status.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error marking news as read." });
      console.error("[ERROR] Error marking news as read:", error);
    } finally {
      setLoading(false);
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

      {message.text && (
        <div className={`message ${message.type}`}>
          <p>{message.text}</p>
          <button onClick={() => setMessage({ type: "", text: "" })}>
            &times;
          </button>
        </div>
      )}

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

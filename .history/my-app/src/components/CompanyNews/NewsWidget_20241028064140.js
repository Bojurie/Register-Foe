import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import { useAuth } from "../AuthContext/AuthContext";
import "./NewsWidget.css";

const NewsWidget = ({ news }) => {
  const { user, markAsReadNews } = useAuth();
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [newsList, setNewsList] = useState(news || []);

  useEffect(() => {
    if (news) {
      console.log("[INFO] Updating news list from passed props:", news);
      setNewsList(news);
    }
  }, [news]);

  const handleNewsClick = async (newsItem) => {
    console.log("[INFO] News item clicked:", newsItem);
    setSelectedNewsItem(newsItem);
    setIsModalOpen(true);

    if (newsItem.isNew) {
      try {
        const response = await markAsReadNews(newsItem._id);
        if (response?.success) {
          console.log("[INFO] Marked as read successfully:", newsItem._id);
          setNewsList((prevNews) =>
            prevNews.map((item) =>
              item._id === newsItem._id ? { ...item, isNew: false } : item
            )
          );
          setMessage({ type: "success", text: "News marked as read!" });
        } else {
          console.warn("[WARN] Failed to mark news as read for:", newsItem._id);
          setMessage({
            type: "warning",
            text: response?.message || "Failed to mark as read.",
          });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Error marking news as read." });
        console.error("[ERROR] Error marking news as read:", error);
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
              {newsList.length > 0 ? (
                newsList.map((newsItem) => (
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

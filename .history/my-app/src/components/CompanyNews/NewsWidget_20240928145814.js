import React, { useState } from "react";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import "./NewsWidget.css";
import { motion, AnimatePresence } from "framer-motion";

const NewsWidget = ({ news = [] }) => {
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Initially collapsed

  const handleNewsClick = (newsItem) => {
    setSelectedNewsItem(newsItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

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
    <div className="NewsWidget-Wrapper">
      <div onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        <h1>{isCollapsed ? "Show Company News" : "Hide Company News"}</h1>
      </div>

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
              {news.length > 0 ? (
                news.map((newsItem, index) => (
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
        <NewsModal newsItem={selectedNewsItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default NewsWidget;
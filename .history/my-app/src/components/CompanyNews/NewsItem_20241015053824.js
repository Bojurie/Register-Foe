import React from "react";
import { motion } from "framer-motion";
import { FaRegNewspaper } from "react-icons/fa";
import "./NewsItem.css";

const NewsItem = ({ newsItem, onClick }) => {
  console.log("NewsItem data:", newsItem); // Log to check each news item data

  const truncateContent = (content, maxLength = 120) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <motion.div
      className={`news-item-container ${newsItem.isNew ? "news-item-new" : ""}`}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      aria-label={`View news: ${newsItem.title}`}
      tabIndex={0}
      role="button"
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
    >
      {newsItem.isNew && (
        <div className="news-item-new-indicator">
          <FaRegNewspaper className="new-news-icon" /> New
        </div>
      )}

      {newsItem.image ? (
        <div className="news-item-image">
          <img src={newsItem.image} alt={newsItem.title} loading="lazy" />
        </div>
      ) : (
        <div className="news-item-image-placeholder">
          <FaRegNewspaper className="news-item-placeholder-icon" />
        </div>
      )}

      <div className="news-item-details">
        <div className="news-item-header">
          <h4 className="news-item-title">{newsItem.title}</h4>
          <p className="news-item-date">
            {new Date(newsItem.date).toLocaleDateString()}
          </p>
        </div>
        <p className="news-item-content">{truncateContent(newsItem.content)}</p>
      </div>
    </motion.div>
  );
};

export default NewsItem;
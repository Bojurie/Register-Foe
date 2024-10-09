import React from "react";
import { motion } from "framer-motion";
import { FaRegNewspaper } from "react-icons/fa";
import "./NewsItem.css";

const NewsItem = ({ newsItem, onClick }) => {
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
    >
      {newsItem.isNew && (
        <div className="news-item-new-indicator">
          <FaRegNewspaper className="new-news-icon" /> New
        </div>
      )}
      {newsItem.image && (
        <div className="news-item-image">
          <img src={newsItem.image} alt={newsItem.title} />
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

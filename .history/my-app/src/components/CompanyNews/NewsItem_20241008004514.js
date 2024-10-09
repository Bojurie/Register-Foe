import React from "react";
import "./NewsItem.css";
import { motion } from "framer-motion";

const NewsItem = ({ newsItem, onClick }) => {
  // Function to truncate content if too long
  const truncateContent = (content, maxLength = 120) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <motion.div
      className="news-item-container"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      {newsItem.image && (
        <div className="news-item-image">
          <img src={newsItem.image} alt={newsItem.title} />
        </div>
      )}
      <div className="news-item-details">
        <div className="news-item-header">
          <h2 className="news-item-title">{newsItem.title}</h2>
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

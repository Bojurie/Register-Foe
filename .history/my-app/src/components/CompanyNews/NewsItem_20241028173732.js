import React, { memo } from "react";
import { motion } from "framer-motion";
import { FaRegNewspaper } from "react-icons/fa";
import "./NewsItem.css";

const NewsItem = memo(({ newsItem, onClick }) => {
  const truncateContent = (content = "", maxLength = 120) => {
    return content?.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content || "No content available";
  };

  return (
    <motion.div
      className={`news-item-container ${newsItem.isNew ? "news-item-new" : ""}`}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
    >
      <div className="news-item-content">
        <div className="news-item-image">
          {newsItem.image ? (
            <img src={newsItem.image} alt={newsItem.title} loading="lazy" />
          ) : (
            <div className="news-item-placeholder" />
          )}
        </div>
        <div className="news-item-text">
          <div className="news-item-header">
            <h4 className="news-item-title">{newsItem.title}</h4>
            <p className="news-item-date">
              {new Date(newsItem.date).toLocaleDateString()}
            </p>
          </div>
          <p className="news-item-snippet">
            {truncateContent(newsItem.content)}
          </p>
          {newsItem.isNew && (
            <div className="news-item-badge">
              <FaRegNewspaper className="news-item-icon" /> New
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default NewsItem;

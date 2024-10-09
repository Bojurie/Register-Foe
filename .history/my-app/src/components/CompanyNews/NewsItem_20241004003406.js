import React from "react";
import "./NewsItem.css";

const NewsItem = ({ newsItem, onClick }) => {
  const truncateContent = (content, maxLength = 100) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div className="news-item" onClick={onClick}>
      <div className="news-item-container">
        {newsItem.image && (
          <div className="news-item-image">
            <img src={newsItem.image} alt={newsItem.title} />
          </div>
        )}
        <div className="news-item-details">
          <div className="news-item-header">
            <h3 className="news-item-title">{newsItem.title}</h3>
            <p className="news-item-date">
              {new Date(newsItem.date).toLocaleDateString()}
            </p>
          </div>
          <p className="news-item-content">
            {truncateContent(newsItem.content)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;

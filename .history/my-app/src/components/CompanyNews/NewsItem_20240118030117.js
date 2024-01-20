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
        <div className="news-item-image">
          <img src={newsItem.imageUrl} alt="News" />
        </div>
        <div className="news-item-details">
          <div className="news-item-top">
            <h3>{newsItem.title}</h3>
            <p>{new Date(newsItem.date).toLocaleDateString()}</p>
          </div>
          <hr />
          <p className="news-item-content">
            {truncateContent(newsItem.content)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
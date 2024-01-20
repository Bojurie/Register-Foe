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
    <div className="news-item-top">
       <h3>{newsItem.title}</h3>
      <p>{new Date(newsItem.date).toLocaleDateString()}</p>
    </div>
     
      <p>{truncateContent(newsItem.content)}</p>
      {/* You can add an image preview here if needed */}
      {/* Other news details */}
    </div>
  );
};

export default NewsItem;

import React from 'react'

const NewsItem = ({ newsItem }) => {
  return (
    <div className="news-item">
      <h3>{newsItem.title}</h3>
      <p>{newsItem.content}</p>
      {/* Other news details */}
    </div>
  );
};

export default NewsItem;


import React, { useState } from "react";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal"; 
import "./NewsWidget.css";

const NewsWidget = ({ news }) => {
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewsClick = (newsItem) => {
    setSelectedNewsItem(newsItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="news-widget">
      {news.map((newsItem, index) => (
        <NewsItem
          key={index}
          newsItem={newsItem}
          onClick={() => handleNewsClick(newsItem)}
        />
      ))}

      {isModalOpen && (
        <NewsModal newsItem={selectedNewsItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default NewsWidget;

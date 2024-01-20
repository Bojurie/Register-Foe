import React, { useState } from "react";
import NewsItem from "./NewsItem";
import NewsModal from "./NewsModal";
import "./NewsWidget.css";
import { motion } from "framer-motion";

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
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="news-widget"
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5 }}
    >
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
    </motion.div>
  );
};

export default NewsWidget;

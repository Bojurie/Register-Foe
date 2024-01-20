import React from "react";
import "./NewsModal.css"; // You'll need to create this CSS file

const NewsModal = ({ newsItem, onClose }) => {
  return (
    <div className="news-modal">
      <div className="news-modal-content">
        <h2>{newsItem.title}</h2>
        <p>{new Date(newsItem.date).toLocaleDateString()}</p>
        <img src={newsItem.image} alt={newsItem.title} />
        <p>{newsItem.content}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NewsModal;

import React from "react";
import "./NewsModal.css";

const NewsModal = ({ newsItem, onClose }) => {
  return (
    <div className="news-modal">
      <div className="news-modal-content">
      <div className="news-top">
        <h2>{newsItem.title}</h2>
        <p>{new Date(newsItem.date).toLocaleDateString()}</p>
      </div>
         <p>{newsItem.content}</p>
        <img src={newsItem.image} alt={newsItem.title} />
       
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NewsModal;

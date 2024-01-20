import React from 'react'
import './NewsWidget.css'
import NewsItem from "./NewsItem"; 

const NewsWidget = ({ news }) => {
  return (
    <div className="news-widget">
      {news.map((newsItem, index) => (
        <NewsItem key={index} newsItem={newsItem} />
      ))}
    </div>
  );
};

export default NewsWidget;

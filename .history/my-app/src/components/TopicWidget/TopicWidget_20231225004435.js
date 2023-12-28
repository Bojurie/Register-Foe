import React from 'react'
import Topic from '../Topic/Topic';

const TopicWidget = ({ companyCode }) => {
  // Assuming companyCode is passed as a prop
  return (
    <div>
    <div><h1>Topics to vote</h1></div>
      <Topic companyCode={companyCode} />
    </div>
  );
};

export default TopicWidget;

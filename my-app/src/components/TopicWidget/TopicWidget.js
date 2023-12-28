import React from 'react'
import Topic from '../Topic/Topic';

const TopicWidget = ({ companyCode }) => {
  // Assuming companyCode is passed as a prop
  return (
    <div>
    <div><h2>Topics to vote</h2></div>
      <Topic companyCode={companyCode} />
    </div>
  );
};

export default TopicWidget;

import React from 'react'
import Topic from '../Topic/Topic';

const TopicsContainer = ({ companyCode }) => {
  // Assuming companyCode is passed as a prop
  return (
    <div>
      <Topic companyCode={companyCode} />
    </div>
  );
};

export default TopicsContainer;

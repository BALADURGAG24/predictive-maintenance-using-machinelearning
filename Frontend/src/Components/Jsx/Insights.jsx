import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Css/Insights.css';

const Insights = () => {
  const location = useLocation();
  const { state } = location;
  const failureType = state?.failureType;
  const insights = state?.insights;

  return (
    <div className="insights-container">
      <h1>Insights </h1>
      {failureType && (
        <div className="insights-info">
          <h2>Predicted Failure Type</h2>
          <p>{failureType}</p>
        </div>
      )}
      {insights && (
        <div className="insights-details">
          <h2>Insights</h2>
          <p>{insights}</p>
        </div>
      )}
    </div>
  );
};

export default Insights;

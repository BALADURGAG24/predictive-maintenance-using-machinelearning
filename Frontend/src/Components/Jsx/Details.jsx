import React from 'react';
import '../Css/Details.css';

const Details = () => {
  const failureTypes = [
    { type: 'No Failure', count: 9652 },
    { type: 'Power Failure', count: 95 },
    { type: 'Over Strain Failure', count: 78 },
    { type: 'Tool Wear Failure', count: 45 },
    { type: 'Random Failure', count: 18 },
    { type: 'Heat Dissipation Failure', count: 112 },
    { type: 'Total', count: 10000 },
  ];

  const typeDistribution = [
    { type: 'High', count: 1003 },
    { type: 'Medium', count: 2997 },
    { type: 'Low', count: 6000 },
    { type: 'Total', count: 10000 },
  ];

  const targetDistribution = [
    { target: 'Target 0', count: 9652 },
    { target: 'Target 1', count: 330 },
    { target: 'Target 0 With Random Failure', count: 18 },
    { target: 'Total', count: 10000 },
  ];

  const metricsData = [
    {
      title: 'Random Failures',
      data: {
        'Air Temperature': { min: 297, max: 302.9 },
        'Process Temperature': { min: 307.7, max: 312.5 },
        'Rotational Speed': { min: 1306, max: 1687 },
        Torque: { min: 27.7, max: 61.2 },
        'Tool Wear': { min: 2, max: 215 },
      },
    },
    {
      title: 'No Failure',
      data: {
        'Air Temperature': { min: 295.3, max: 304.5 },
        'Process Temperature': { min: 305.7, max: 313.8 },
        'Rotational Speed': { min: 1168, max: 2695 },
        Torque: { min: 12.6, max: 70 },
        'Tool Wear': { min: 0, max: 246 },
      },
    },
    {
      title: 'Heat Dissipation Failure',
      data: {
        'Air Temperature': { min: 300.8, max: 303.7 },
        'Process Temperature': { min: 309.4, max: 312.2 },
        'Rotational Speed': { min: 1212, max: 1379 },
        Torque: { min: 41.6, max: 67.8 },
        'Tool Wear': { min: 2, max: 229 },
      },
    },
    {
      title: 'Power Failure',
      data: {
        'Air Temperature': { min: 295.7, max: 304 },
        'Process Temperature': { min: 306.2, max: 313.2 },
        'Rotational Speed': { min: 1200, max: 2886 },
        Torque: { min: 3.8, max: 76.6 },
        'Tool Wear': { min: 0, max: 234 },
      },
    },
    {
      title: 'Tool Wear Failure',
      data: {
        'Air Temperature': { min: 296.9, max: 304.4 },
        'Process Temperature': { min: 307.4, max: 313.7 },
        'Rotational Speed': { min: 1323, max: 2271 },
        Torque: { min: 16.2, max: 62.4 },
        'Tool Wear': { min: 198, max: 253 },
      },
    },
    {
      title: 'Over Strain Failure',
      data: {
        'Air Temperature': { min: 295.6, max: 304 },
        'Process Temperature': { min: 306.1, max: 313.1 },
        'Rotational Speed': { min: 1181, max: 1515 },
        Torque: { min: 46.3, max: 68.2 },
        'Tool Wear': { min: 177, max: 251 },
      },
    },
  ];

  return (
    <div className="details-container">
      <h1 className="details-title">Machine Failure Analysis</h1>

      {/* Failure Type Table */}
      <div className="details-table-container">
        <h2>Failure Type Distribution</h2>
        <table className="details-table">
          <thead>
            <tr>
              <th>Failure Type</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {failureTypes.map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Type Distribution Table */}
      <div className="details-table-container">
        <h2>Type Distribution</h2>
        <table className="details-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {typeDistribution.map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Target Distribution Table */}
      <div className="details-table-container">
        <h2>Target Distribution</h2>
        <table className="details-table">
          <thead>
            <tr>
              <th>Target</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {targetDistribution.map((item, index) => (
              <tr key={index}>
                <td>{item.target}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metric Ranges for Different Failures */}
      <div className="details-metrics-container">
        <h2>Metrics Ranges by Failure Type</h2>
        {metricsData.map((metric, index) => (
          <div key={index} className="details-metric-block">
            <h3>{metric.title}</h3>
            <table className="details-metric-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Min</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(metric.data).map((key) => (
                  <tr key={key} className={`metric-${key.toLowerCase().replace(/\s+/g, '-')}`}>
                    <td>{key}</td>
                    <td>{metric.data[key].min}</td>
                    <td>{metric.data[key].max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;

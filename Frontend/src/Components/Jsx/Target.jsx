import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import machineData from './machine_data.csv';
import '../Css/Target.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Target = () => {
  const [data, setData] = useState({
    airTemperatureTarget0: null,
    airTemperatureTarget1: null,
    processTemperatureTarget0: null,
    processTemperatureTarget1: null,
    torqueTarget0: null,
    torqueTarget1: null,
    rotationalSpeedTarget0: null,
    rotationalSpeedTarget1: null,
    toolWearTarget0: null,
    toolWearTarget1: null,
    countsData: null,
    targetDistribution: null
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    Papa.parse(machineData, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const metrics = {
          airTemperature: { target0: [], target1: [], stats: {} },
          processTemperature: { target0: [], target1: [], stats: {} },
          rotationalSpeed: { target0: [], target1: [], stats: {} },
          torque: { target0: [], target1: [], stats: {} },
          toolWear: { target0: [], target1: [], stats: {} },
        };

        result.data.forEach(item => {
          const target = item['Target'];
          const airTemp = item['Air temperature [K]'];
          const processTemp = item['Process temperature [K]'];
          const rotationalSpeed = item['Rotational speed [rpm]'];
          const torque = item['Torque [Nm]'];
          const toolWear = item['Tool wear [min]'];

          const pushMetricData = (metric, value) => {
            if (target === 1) {
              if (value !== undefined) metric.target1.push(value);
            } else if (target === 0) {
              if (value !== undefined) metric.target0.push(value);
            }
          };

          pushMetricData(metrics.airTemperature, airTemp);
          pushMetricData(metrics.processTemperature, processTemp);
          pushMetricData(metrics.rotationalSpeed, rotationalSpeed);
          pushMetricData(metrics.torque, torque);
          pushMetricData(metrics.toolWear, toolWear);
        });

        const calculateStats = (dataArray) => {
          if (dataArray.length === 0) return { min: 0, max: 0, avg: 0 };
          const min = Math.min(...dataArray);
          const max = Math.max(...dataArray);
          const avg = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          return { min, max, avg };
        };

        for (const key in metrics) {
          metrics[key].stats.target0 = calculateStats(metrics[key].target0);
          metrics[key].stats.target1 = calculateStats(metrics[key].target1);
        }

        setData({
          airTemperatureTarget0: {
            labels: metrics.airTemperature.target0.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Air Temperature for Target 0', data: metrics.airTemperature.target0, borderColor: 'black', backgroundColor: 'rgba(54, 162, 235, 0.6)' }],
            stats: metrics.airTemperature.stats.target0
          },
          airTemperatureTarget1: {
            labels: metrics.airTemperature.target1.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Air Temperature for Target 1', data: metrics.airTemperature.target1, borderColor: 'black', backgroundColor: 'rgba(54, 162, 235, 0.6)' }],
            stats: metrics.airTemperature.stats.target1
          },
          processTemperatureTarget0: {
            labels: metrics.processTemperature.target0.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Process Temperature for Target 0', data: metrics.processTemperature.target0, borderColor: 'black', backgroundColor: 'rgba(255, 159, 64, 0.6)' }],
            stats: metrics.processTemperature.stats.target0
          },
          processTemperatureTarget1: {
            labels: metrics.processTemperature.target1.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Process Temperature for Target 1', data: metrics.processTemperature.target1, borderColor: 'black', backgroundColor: 'rgba(255, 159, 64, 0.6)' }],
            stats: metrics.processTemperature.stats.target1
          },
          torqueTarget0: {
            labels: metrics.torque.target0.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Torque for Target 0', data: metrics.torque.target0, borderColor: 'black', backgroundColor: 'rgba(255, 99, 132, 0.6)' }],
            stats: metrics.torque.stats.target0
          },
          torqueTarget1: {
            labels: metrics.torque.target1.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Torque for Target 1', data: metrics.torque.target1, borderColor: 'black', backgroundColor: 'rgba(255, 99, 132, 0.6)' }],
            stats: metrics.torque.stats.target1
          },
          rotationalSpeedTarget0: {
            labels: metrics.rotationalSpeed.target0.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Rotational Speed for Target 0', data: metrics.rotationalSpeed.target0, borderColor: 'black', backgroundColor: 'rgba(153, 102, 255, 0.6)' }],
            stats: metrics.rotationalSpeed.stats.target0
          },
          rotationalSpeedTarget1: {
            labels: metrics.rotationalSpeed.target1.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Rotational Speed for Target 1', data: metrics.rotationalSpeed.target1, borderColor: 'black', backgroundColor: 'rgba(153, 102, 255, 0.6)' }],
            stats: metrics.rotationalSpeed.stats.target1
          },
          toolWearTarget0: {
            labels: metrics.toolWear.target0.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Tool Wear for Target 0', data: metrics.toolWear.target0, borderColor: 'black', backgroundColor: 'rgba(128, 128, 128, 0.6)' }],
            stats: metrics.toolWear.stats.target0
          },
          toolWearTarget1: {
            labels: metrics.toolWear.target1.map((_, index) => `Point ${index + 1}`),
            datasets: [{ label: 'Tool Wear for Target 1', data: metrics.toolWear.target1, borderColor: 'black', backgroundColor: 'rgba(128, 128, 128, 0.6)' }],
            stats: metrics.toolWear.stats.target1
          },
          countsData: {
            labels: ['Air Temperature', 'Process Temperature', 'Rotational Speed', 'Torque', 'Tool Wear'],
            datasets: [
              { label: 'Target 0', data: [
                metrics.airTemperature.target0.length,
                metrics.processTemperature.target0.length,
                metrics.rotationalSpeed.target0.length,
                metrics.torque.target0.length,
                metrics.toolWear.target0.length
              ], backgroundColor: 'rgba(255, 159, 64, 0.6)' },
              { label: 'Target 1', data: [
                metrics.airTemperature.target1.length,
                metrics.processTemperature.target1.length,
                metrics.rotationalSpeed.target1.length,
                metrics.torque.target1.length,
                metrics.toolWear.target1.length
              ], backgroundColor: 'rgba(54, 162, 235, 0.6)' }
            ]
          },
          targetDistribution: {
            labels: ['Target 0', 'Target 1'],
            datasets: [
              { label: 'Distribution of Targets', data: [
                metrics.airTemperature.target0.length +
                metrics.processTemperature.target0.length +
                metrics.rotationalSpeed.target0.length +
                metrics.torque.target0.length +
                metrics.toolWear.target0.length,
                metrics.airTemperature.target1.length +
                metrics.processTemperature.target1.length +
                metrics.rotationalSpeed.target1.length +
                metrics.torque.target1.length +
                metrics.toolWear.target1.length
              ], backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(54, 162, 235, 0.6)'] }
            ]
          }
        });

        setChartOptions({
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Temperature and Operational Metrics Distributions' },
          },
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  }, []);

  return (
    <div className="target-dashboard">
      <h2 className="dashboard-title">Temperature and Operational Metrics Distributions</h2>

      <div className="chart-panel">
        <h3 className="chart-panel-title">Target Distribution</h3>
        <div className="chart-content">
          {data.targetDistribution ? <Bar data={data.targetDistribution} options={chartOptions} /> : <p className="loading-state">Loading Target Distribution Chart...</p>}
        </div>
      </div>
      
      <div className="chart-panel">
        <h3 className="chart-panel-title">Counts of Metrics by Target</h3>
        <div className="chart-content">
          {data.countsData ? <Bar data={data.countsData} options={chartOptions} /> : <p className="loading-state">Loading Counts Chart...</p>}
        </div>
      </div>

      <div className="chart-grid">
        {['airTemperature', 'processTemperature', 'rotationalSpeed', 'torque', 'toolWear'].map((metric, index) => (
          <>
            <div className="chart-item" key={`${metric}0`}>
              <h3 className="metric-title">{`${capitalizeFirstLetter(metric)} Target 0`}</h3>
              {data[`${metric}Target0`] ? (
                <>
                  <Bar data={data[`${metric}Target0`]} options={chartOptions} />
                  <div className="metric-stats">
                    <p>Min: {data[`${metric}Target0`].stats.min.toFixed(2)}</p>
                    <p>Avg: {data[`${metric}Target0`].stats.avg.toFixed(2)}</p>
                    <p>Max: {data[`${metric}Target0`].stats.max.toFixed(2)}</p>
                  </div>
                </>
              ) : <p className="loading-state">Loading {`${metric} Target 0`} Chart...</p>}
            </div>
            <div className="chart-item" key={`${metric}1`}>
              <h3 className="metric-title">{`${capitalizeFirstLetter(metric)} Target 1`}</h3>
              {data[`${metric}Target1`] ? (
                <>
                  <Bar data={data[`${metric}Target1`]} options={chartOptions} />
                  <div className="metric-stats">
                    <p>Min: {data[`${metric}Target1`].stats.min.toFixed(2)}</p>
                    <p>Avg: {data[`${metric}Target1`].stats.avg.toFixed(2)}</p>
                    <p>Max: {data[`${metric}Target1`].stats.max.toFixed(2)}</p>
                  </div>
                </>
              ) : <p className="loading-state">Loading {`${metric} Target 1`} Chart...</p>}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

// Utility function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Target;

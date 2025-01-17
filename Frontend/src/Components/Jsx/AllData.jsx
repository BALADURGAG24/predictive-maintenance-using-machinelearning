import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import machineData from './machine_data.csv';
import '../Css/AllData.css';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const MachineMetrics = () => {
  const [data, setData] = useState({
    airTemperature: [],
    processTemperature: [],
    rotationalSpeed: [],
    torque: [],
    toolWear: [],
    target: [],
  });

  const [charts, setCharts] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    Papa.parse(machineData, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const airTemperature = [];
        const processTemperature = [];
        const rotationalSpeed = [];
        const torque = [];
        const toolWear = [];
        const target = [];

        result.data.forEach(item => {
          airTemperature.push(item['Air temperature [K]']);
          processTemperature.push(item['Process temperature [K]']);
          rotationalSpeed.push(item['Rotational speed [rpm]']);
          torque.push(item['Torque [Nm]']);
          toolWear.push(item['Tool wear [min]']);
          target.push(item['Target']); 
        });

        const calculateStats = (array) => {
          const min = Math.min(...array);
          const max = Math.max(...array);
          const avg = array.reduce((a, b) => a + b, 0) / array.length;
          return { min, max, avg };
        };

        setData({
          airTemperature,
          processTemperature,
          rotationalSpeed,
          torque,
          toolWear,
          target,
        });

        setStats({
          airTemperature: calculateStats(airTemperature),
          processTemperature: calculateStats(processTemperature),
          rotationalSpeed: calculateStats(rotationalSpeed),
          torque: calculateStats(torque),
          toolWear: calculateStats(toolWear),
          target: calculateStats(target),
        });

        setCharts({
          airTemperatureChart: {
            labels: Array.from({ length: airTemperature.length }, (_, i) => i + 1),
            datasets: [{
              label: 'Air Temperature [K]',
              data: airTemperature,
              borderColor: 'blue',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              pointStyle: 'circle',
              pointRadius: 3,
              fill: true,
              tension: 0.1,
            }],
          },
          processTemperatureChart: {
            labels: Array.from({ length: processTemperature.length }, (_, i) => i + 1),
            datasets: [{
              label: 'Process Temperature [K]',
              data: processTemperature,
              borderColor: 'orange',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              pointStyle: 'circle',
              pointRadius: 3,
              fill: true,
              tension: 0.1,
            }],
          },
          rotationalSpeedChart: {
            labels: Array.from({ length: rotationalSpeed.length }, (_, i) => i + 1),
            datasets: [{
              label: 'Rotational Speed [rpm]',
              data: rotationalSpeed,
              borderColor: 'purple',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              pointStyle: 'circle',
              pointRadius: 3,
              fill: true,
              tension: 0.1,
            }],
          },
          torqueChart: {
            labels: Array.from({ length: torque.length }, (_, i) => i + 1),
            datasets: [{
              label: 'Torque [Nm]',
              data: torque,
              borderColor: 'red',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              pointStyle: 'circle',
              pointRadius: 3,
              fill: true,
              tension: 0.1,
            }],
          },
          toolWearChart: {
            labels: Array.from({ length: toolWear.length }, (_, i) => i + 1),
            datasets: [{
              label: 'Tool Wear [min]',
              data: toolWear,
              borderColor: 'grey',
              backgroundColor: 'rgba(128, 128, 128, 0.2)',
              pointStyle: 'circle',
              pointRadius: 3,
              fill: true,
              tension: 0.1,
            }],
          },
          targetChart: {
            labels: Array.from({ length: target.length }, (_, i) => i + 1),
            datasets: [{
              label: 'Target',
              data: target,
              borderColor: 'teal',
              backgroundColor: 'rgba(0, 128, 128, 0.2)',
              pointStyle: 'circle',
              pointRadius: 3,
              fill: true,
              tension: 0.1,
            }],
          },
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  }, []);

  const renderStats = (stat) => (
    <div className="metrics-stats">
      <p><strong>Min:</strong> {stat.min}</p>
      <p><strong>Avg:</strong> {stat.avg.toFixed(2)}</p>
      <p><strong>Max:</strong> {stat.max}</p>
    </div>
  );

  return (
    <div className="metrics-container">
      <div className="metrics-chart-container">
        <h3>Air Temperature [K]</h3>
        {charts.airTemperatureChart ? (
          <>
            <Line data={charts.airTemperatureChart} className="metrics-chart" />
            {stats.airTemperature && renderStats(stats.airTemperature)}
          </>
        ) : <p>Loading Air Temperature Chart...</p>}
      </div>
      <div className="metrics-chart-container">
        <h3>Process Temperature [K]</h3>
        {charts.processTemperatureChart ? (
          <>
            <Line data={charts.processTemperatureChart} className="metrics-chart" />
            {stats.processTemperature && renderStats(stats.processTemperature)}
          </>
        ) : <p>Loading Process Temperature Chart...</p>}
      </div>
      <div className="metrics-chart-container">
        <h3>Rotational Speed [rpm]</h3>
        {charts.rotationalSpeedChart ? (
          <>
            <Line data={charts.rotationalSpeedChart} className="metrics-chart" />
            {stats.rotationalSpeed && renderStats(stats.rotationalSpeed)}
          </>
        ) : <p>Loading Rotational Speed Chart...</p>}
      </div>
      <div className="metrics-chart-container">
        <h3>Torque [Nm]</h3>
        {charts.torqueChart ? (
          <>
            <Line data={charts.torqueChart} className="metrics-chart" />
            {stats.torque && renderStats(stats.torque)}
          </>
        ) : <p>Loading Torque Chart...</p>}
      </div>
      <div className="metrics-chart-container">
        <h3>Tool Wear [min]</h3>
        {charts.toolWearChart ? (
          <>
            <Line data={charts.toolWearChart} className="metrics-chart" />
            {stats.toolWear && renderStats(stats.toolWear)}
          </>
        ) : <p>Loading Tool Wear Chart...</p>}
      </div>
      <div className="metrics-chart-container">
        <h3>Target</h3>
        {charts.targetChart ? (
          <>
            <Line data={charts.targetChart} className="metrics-chart" />
            {stats.target && renderStats(stats.target)}
          </>
        ) : <p>Loading Target Chart...</p>}
      </div>
    </div>
  );
};

export default MachineMetrics;

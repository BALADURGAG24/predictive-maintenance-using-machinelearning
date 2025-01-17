import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import machineData from './machine_data.csv';
import '../Css/Type.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Type = () => {
  const [chartsData, setChartsData] = useState({
    typeDistribution: null,
    countsByMetric: null,
    airTempL: null,
    processTempL: null,
    rotationalSpeedL: null,
    torqueL: null,
    toolWearL: null,
    airTempM: null,
    processTempM: null,
    rotationalSpeedM: null,
    torqueM: null,
    toolWearM: null,
    airTempH: null,
    processTempH: null,
    rotationalSpeedH: null,
    torqueH: null,
    toolWearH: null,
  });

  const calculateStats = (data) => {
    if (data.length === 0) return { min: null, max: null, avg: null };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const avg = data.reduce((acc, val) => acc + val, 0) / data.length;
    return { min, max, avg };
  };

  useEffect(() => {
    Papa.parse(machineData, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data;

        const filterData = (type, metric) => data
          .filter(item => item['Type'] === type)
          .map(item => item[metric]);

        const typeCounts = data.reduce((acc, item) => {
          const type = item['Type'];
          if (type) {
            acc[type] = (acc[type] || 0) + 1;
          }
          return acc;
        }, {});

        const metricsCounts = {
          airTemp: { H: 0, M: 0, L: 0 },
          processTemp: { H: 0, M: 0, L: 0 },
          rotationalSpeed: { H: 0, M: 0, L: 0 },
          torque: { H: 0, M: 0, L: 0 },
          toolWear: { H: 0, M: 0, L: 0 },
        };

        data.forEach(item => {
          const type = item['Type'];
          if (metricsCounts.airTemp[type] !== undefined) {
            metricsCounts.airTemp[type] += 1;
          }
          if (metricsCounts.processTemp[type] !== undefined) {
            metricsCounts.processTemp[type] += 1;
          }
          if (metricsCounts.rotationalSpeed[type] !== undefined) {
            metricsCounts.rotationalSpeed[type] += 1;
          }
          if (metricsCounts.torque[type] !== undefined) {
            metricsCounts.torque[type] += 1;
          }
          if (metricsCounts.toolWear[type] !== undefined) {
            metricsCounts.toolWear[type] += 1;
          }
        });

        const prepareChartData = (dataset, label, color) => ({
          labels: dataset.map((_, index) => `Record ${index + 1}`),
          datasets: [
            {
              label: label,
              data: dataset,
              borderColor: color,
              backgroundColor: `${color}60`,
            },
          ],
        });

        const typeDistributionData = {
          labels: Object.keys(typeCounts),
          datasets: [
            {
              label: 'Count',
              data: Object.values(typeCounts),
              backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)'], // Blue, Orange, Purple
            },
          ],
        };
        
        const countsByMetricData = {
          labels: ['Air Temperature', 'Process Temperature', 'Rotational Speed', 'Torque', 'Tool Wear'],
          datasets: [
            {
              label: 'Type H',
              data: [
                metricsCounts.airTemp.H,
                metricsCounts.processTemp.H,
                metricsCounts.rotationalSpeed.H,
                metricsCounts.torque.H,
                metricsCounts.toolWear.H,
              ],
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
            },
            {
              label: 'Type M',
              data: [
                metricsCounts.airTemp.M,
                metricsCounts.processTemp.M,
                metricsCounts.rotationalSpeed.M,
                metricsCounts.torque.M,
                metricsCounts.toolWear.M,
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
            },
            {
              label: 'Type L',
              data: [
                metricsCounts.airTemp.L,
                metricsCounts.processTemp.L,
                metricsCounts.rotationalSpeed.L,
                metricsCounts.torque.L,
                metricsCounts.toolWear.L,
              ],
              backgroundColor: 'rgba(255, 159, 64, 0.6)', // Orange
            },
          ],
        };

        setChartsData({
          typeDistribution: typeDistributionData,
          countsByMetric: countsByMetricData,
          airTempL: prepareChartData(filterData('L', 'Air temperature [K]'), 'Air Temperature', '#0000FF'), // Blue
          processTempL: prepareChartData(filterData('L', 'Process temperature [K]'), 'Process Temperature', '#FFA500'), // Orange
          rotationalSpeedL: prepareChartData(filterData('L', 'Rotational speed [rpm]'), 'Rotational Speed', '#800080'), // Purple
          torqueL: prepareChartData(filterData('L', 'Torque [Nm]'), 'Torque', '#FF0000'), // Red
          toolWearL: prepareChartData(filterData('L', 'Tool wear [min]'), 'Tool Wear', '#808080'), // Grey
          airTempM: prepareChartData(filterData('M', 'Air temperature [K]'), 'Air Temperature', '#0000FF'), // Blue
          processTempM: prepareChartData(filterData('M', 'Process temperature [K]'), 'Process Temperature', '#FFA500'), // Orange
          rotationalSpeedM: prepareChartData(filterData('M', 'Rotational speed [rpm]'), 'Rotational Speed', '#800080'), // Purple
          torqueM: prepareChartData(filterData('M', 'Torque [Nm]'), 'Torque', '#FF0000'), // Red
          toolWearM: prepareChartData(filterData('M', 'Tool wear [min]'), 'Tool Wear', '#808080'), // Grey
          airTempH: prepareChartData(filterData('H', 'Air temperature [K]'), 'Air Temperature', '#0000FF'), // Blue
          processTempH: prepareChartData(filterData('H', 'Process temperature [K]'), 'Process Temperature', '#FFA500'), // Orange
          rotationalSpeedH: prepareChartData(filterData('H', 'Rotational speed [rpm]'), 'Rotational Speed', '#800080'), // Purple
          torqueH: prepareChartData(filterData('H', 'Torque [Nm]'), 'Torque', '#FF0000'), // Red
          toolWearH: prepareChartData(filterData('H', 'Tool wear [min]'), 'Tool Wear', '#808080'), // Grey
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true },
    },
  };

  const renderChartWithStats = (data, title) => {
    if (!data) return null;

    const stats = calculateStats(data.datasets[0].data);

    return (
      <div className="chart-item">
        <h3 className="chart-title">{title}</h3>
        <Bar data={data} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: title } }}} />
        <div className="chart-stats">
          <p>Min: {stats.min}</p>
          <p>Avg: {stats.avg.toFixed(2)}</p>
          <p>Max: {stats.max}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="chart-container">
      <h2 className="chart-header">Type Distribution</h2>
      
      {/* Pie chart for Type Distribution */}
      {chartsData.typeDistribution && (
        <div className="pie-chart-container chart-item">
          <h3 className="chart-title">Type Distribution (H, M, L)</h3>
          <Pie data={chartsData.typeDistribution} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Type Distribution (H, M, L)' } }}} />
        </div>
      )}

      {chartsData.countsByMetric && (
        <div className="chart-category">
          <h3 className="chart-title">Counts of Metrics by Target</h3>
          <Bar data={chartsData.countsByMetric} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Counts of Metrics by Target' } }}} />
        </div>
      )}

      <div className="chart-grid">
        {renderChartWithStats(chartsData.airTempL, 'Air Temperature (Type L)')}
        {renderChartWithStats(chartsData.processTempL, 'Process Temperature (Type L)')}
        {renderChartWithStats(chartsData.rotationalSpeedL, 'Rotational Speed (Type L)')}
        {renderChartWithStats(chartsData.torqueL, 'Torque (Type L)')}
        {renderChartWithStats(chartsData.toolWearL, 'Tool Wear (Type L)')}

        {renderChartWithStats(chartsData.airTempM, 'Air Temperature (Type M)')}
        {renderChartWithStats(chartsData.processTempM, 'Process Temperature (Type M)')}
        {renderChartWithStats(chartsData.rotationalSpeedM, 'Rotational Speed (Type M)')}
        {renderChartWithStats(chartsData.torqueM, 'Torque (Type M)')}
        {renderChartWithStats(chartsData.toolWearM, 'Tool Wear (Type M)')}

        {renderChartWithStats(chartsData.airTempH, 'Air Temperature (Type H)')}
        {renderChartWithStats(chartsData.processTempH, 'Process Temperature (Type H)')}
        {renderChartWithStats(chartsData.rotationalSpeedH, 'Rotational Speed (Type H)')}
        {renderChartWithStats(chartsData.torqueH, 'Torque (Type H)')}
        {renderChartWithStats(chartsData.toolWearH, 'Tool Wear (Type H)')}
      </div>

      {(!chartsData.typeDistribution && !chartsData.countsByMetric &&
        !chartsData.airTempL && !chartsData.processTempL && !chartsData.rotationalSpeedL && !chartsData.torqueL && !chartsData.toolWearL &&
        !chartsData.airTempM && !chartsData.processTempM && !chartsData.rotationalSpeedM && !chartsData.torqueM && !chartsData.toolWearM &&
        !chartsData.airTempH && !chartsData.processTempH && !chartsData.rotationalSpeedH && !chartsData.torqueH && !chartsData.toolWearH) && <p className="loading-text">Loading Charts...</p>}
    </div>
  );
};

export default Type;

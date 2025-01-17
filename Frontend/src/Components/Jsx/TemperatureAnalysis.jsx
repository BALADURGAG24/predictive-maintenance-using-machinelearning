import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import machineData from './machine_data.csv';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const TemperatureWear = () => {
  const [temperatureWearData, setTemperatureWearData] = useState(null);
  const [speedTorqueData, setSpeedTorqueData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    Papa.parse(machineData, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data;

        // Air Temperature vs Process Temperature Scatter Data
        const scatterDataTempWear = data
          .filter(item => item['Air temperature [K]'] !== null && item['Process temperature [K]'] !== null)
          .map(item => ({
            x: item['Air temperature [K]'],
            y: item['Process temperature [K]'],
          }));

        setTemperatureWearData({
          datasets: [
            {
              label: 'Process Temperature vs Air Temperature',
              data: scatterDataTempWear,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        });

        // Rotational Speed vs Torque Scatter Data
        const scatterDataSpeedTorque = data
          .filter(item => item['Rotational speed [rpm]'] !== null && item['Torque [Nm]'] !== null)
          .map(item => ({
            x: item['Rotational speed [rpm]'],
            y: item['Torque [Nm]'],
          }));

        setSpeedTorqueData({
          datasets: [
            {
              label: 'Torque vs Rotational Speed',
              data: scatterDataSpeedTorque,
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
          ],
        });

        setChartOptions({
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true },
          },
          scales: {
            x: {
              title: { display: true },
            },
            y: {
              title: { display: true },
            },
          },
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  }, []);

  return (
    <div>
      <h2>Air Temperature vs Process Temperature</h2>
      {temperatureWearData ? (
        <Scatter
          data={temperatureWearData}
          options={{
            ...chartOptions,
            plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Air Temperature vs Process Temperature' } },
            scales: {
              ...chartOptions.scales,
              x: { ...chartOptions.scales.x, title: { text: 'Air Temperature [K]' } },
              y: { ...chartOptions.scales.y, title: { text: 'Process Temperature [K]' } },
            },
          }}
        />
      ) : (
        <p>Loading Scatter Plot...</p>
      )}

      <h2>Rotational Speed vs Torque</h2>
      {speedTorqueData ? (
        <Scatter
          data={speedTorqueData}
          options={{
            ...chartOptions,
            plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Rotational Speed vs Torque' } },
            scales: {
              ...chartOptions.scales,
              x: { ...chartOptions.scales.x, title: { text: 'Rotational Speed [rpm]' } },
              y: { ...chartOptions.scales.y, title: { text: 'Torque [Nm]' } },
            },
          }}
        />
      ) : (
        <p>Loading Scatter Plot...</p>
      )}
    </div>
  );
};

export default TemperatureWear;

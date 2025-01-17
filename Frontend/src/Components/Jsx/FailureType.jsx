import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import machineData from './machine_data.csv';
import '../Css/FailureType.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FailureType = () => {
  const [chartsData, setChartsData] = useState({});
  const [failureTypeData, setFailureTypeData] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Failure Type Metrics' },
    },
    scales: {
      x: {
        ticks: { color: '#333' },
        grid: { color: '#ccc' },
      },
      y: {
        ticks: { color: '#333' },
        grid: { color: '#ccc' },
      },
    },
  });
  const [metricCountsData, setMetricCountsData] = useState(null);

  // Utility function to calculate min, max, and avg
  const calculateStats = (dataArray) => {
    if (dataArray.length === 0) return { min: 0, max: 0, avg: 0 };
    const min = Math.min(...dataArray);
    const max = Math.max(...dataArray);
    const avg = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    return { min, max, avg };
  };

  useEffect(() => {
    Papa.parse(machineData, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data;
        
        // Check if data is an array and not empty
        if (!Array.isArray(data) || data.length === 0) {
          console.error('Parsed data is not an array or is empty');
          return;
        }

        // Failure type counts
        const failureTypeCounts = data.reduce((acc, item) => {
          const failureType = item['Failure Type'];
          if (failureType) {
            acc[failureType] = (acc[failureType] || 0) + 1;
          }
          return acc;
        }, {});

        setFailureTypeData({
          labels: Object.keys(failureTypeCounts),
          datasets: [
            {
              label: 'Number of Failures',
              data: Object.values(failureTypeCounts),
              borderColor: '#4A90E2',
              backgroundColor: 'rgba(74, 144, 226, 0.6)',
            },
          ],
        });

        // Metric data
        const filterData = (failureType, metric) => {
          const filteredData = data.filter(item => item['Failure Type'] === failureType);
          let color;

          switch (metric) {
            case 'Air temperature [K]':
              color = '#4A90E2';
              break;
            case 'Process temperature [K]':
              color = '#F5A623';
              break;
            case 'Rotational speed [rpm]':
              color = '#9B59B6';
              break;
            case 'Torque [Nm]':
              color = '#E74C3C';
              break;
            case 'Tool wear [min]':
              color = '#BDC3C7';
              break;
            default:
              color = '#7F8C8D';
          }

          const dataValues = filteredData.map(item => item[metric]);
          const stats = calculateStats(dataValues);

          return {
            labels: filteredData.map((_, index) => `Record ${index + 1}`),
            datasets: [
              {
                label: metric,
                data: dataValues,
                borderColor: color,
                backgroundColor: color + '99',
              },
            ],
            stats: stats
          };
        };

        const metrics = [
          'Air temperature [K]',
          'Process temperature [K]',
          'Rotational speed [rpm]',
          'Torque [Nm]',
          'Tool wear [min]',
        ];

        const getFailureTypeData = (failureType) => {
          const metricData = {};
          metrics.forEach(metric => {
            metricData[metric] = filterData(failureType, metric);
          });
          return metricData;
        };

        setChartsData({
          noFailure: getFailureTypeData('No Failure'),
          powerFailure: getFailureTypeData('Power Failure'),
          toolWearFailure: getFailureTypeData('Tool Wear Failure'),
          overstrainFailure: getFailureTypeData('Overstrain Failure'),
          randomFailures: getFailureTypeData('Random Failures'),
          heatDissipationFailure: getFailureTypeData('Heat Dissipation Failure'),
        });

        // Calculate counts of each metric by target (failure type)
        const metricCounts = metrics.reduce((acc, metric) => {
          acc[metric] = data.reduce((metricAcc, item) => {
            const failureType = item['Failure Type'];
            if (failureType) {
              metricAcc[failureType] = (metricAcc[failureType] || 0) + 1;
            }
            return metricAcc;
          }, {});
          return acc;
        }, {});

        setMetricCountsData({
          labels: Object.keys(failureTypeCounts),
          datasets: metrics.map(metric => {
            let color;

            switch (metric) {
              case 'Air temperature [K]':
                color = '#4A90E2';
                break;
              case 'Process temperature [K]':
                color = '#F5A623';
                break;
              case 'Rotational speed [rpm]':
                color = '#9B59B6';
                break;
              case 'Torque [Nm]':
                color = '#E74C3C';
                break;
              case 'Tool wear [min]':
                color = '#BDC3C7';
                break;
              default:
                color = '#7F8C8D';
            }

            return {
              label: metric,
              data: Object.values(metricCounts[metric] || {}),
              borderColor: color,
              backgroundColor: color + '99',
            };
          }),
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  }, []);

  const renderMetricCharts = (metric) => {
    return (
      <div className="metric-container" key={metric}>
        <h3 className="metric-title">{metric}</h3>
        <div className="chart-grid">
          {Object.entries(chartsData).map(([failureType, data]) => (
            <div className="chart-item" key={failureType}>
              <h4>{failureType}</h4>
              <Bar
                data={data[metric] || {}}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins?.title,
                      text: `${failureType} - ${metric}`
                    }
                  }
                }}
              />
              <div className="metric-stats">
                {data[metric]?.stats ? (
                  <>
                    <p>Min: {data[metric]?.stats?.min?.toFixed(2) || 'N/A'}</p>
                    <p>Avg: {data[metric]?.stats?.avg?.toFixed(2) || 'N/A'}</p>
                    <p>Max: {data[metric]?.stats?.max?.toFixed(2) || 'N/A'}</p>
                  </>
                ) : (
                  <p>Loading stats...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="failure-type-container">
      <h2 className="section-title">Failure Metrics by Type</h2>
      
      {/* Number of Failures Chart */}
      <div className="chart-container">
        <h3 className="chart-subtitle">Number of Failures by Type</h3>
        {failureTypeData ? (
          <Bar data={failureTypeData} options={chartOptions} />
        ) : (
          <p>Loading Failure Types Chart...</p>
        )}
      </div>

      {/* Metrics Counts Chart */}
      <div className="chart-container">
        <h3 className="chart-subtitle">Metrics Counts by Type</h3>
        {metricCountsData ? (
          <Bar data={metricCountsData} options={chartOptions} />
        ) : (
          <p>Loading Metrics Counts Chart...</p>
        )}
      </div>

      {/* Metric Charts */}
      {['Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Tool wear [min]'].map(metric => (
        <React.Fragment key={metric}>
          {renderMetricCharts(metric)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FailureType;

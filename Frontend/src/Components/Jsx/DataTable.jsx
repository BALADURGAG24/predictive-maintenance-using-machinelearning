import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import machineData from './machine_data.csv';
import '../Css/DataTable.css';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ITEMS_PER_PAGE = 10;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = ['UDI', 'Product ID', 'Type', 'Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Tool wear [min]', 'Target', 'Failure Type'];

  useEffect(() => {
    Papa.parse(machineData, {
      download: true,
      header: true,
      complete: (results) => {
        const normalizedData = results.data.map(item => {
          return Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key.trim(), value])
          );
        });

        setData(normalizedData);
        setFilteredData(normalizedData);
      },
    });
  }, []);

  useEffect(() => {
    let filtered = data;

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        filtered = filtered.filter(row =>
          row[key]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    }

    if (sortConfig) {
      const { key, direction } = sortConfig;
      filtered = [...filtered].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [data, sortConfig, filters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const getColumnClass = (column) => {
    switch (column) {
      case 'Air temperature [K]':
        return 'air-temperature';
      case 'Process temperature [K]':
        return 'process-temperature';
      case 'Rotational speed [rpm]':
        return 'rotational-speed';
      case 'Torque [Nm]':
        return 'torque';
      case 'Tool wear [min]':
        return 'tool-wear';
      default:
        return '';
    }
  };

  // Prepare data for charts
  const chartData = {
    labels: paginatedData.map(row => row['UDI']),
    datasets: [
      {
        label: 'Air Temperature [K]',
        data: paginatedData.map(row => parseFloat(row['Air temperature [K]'] || 0)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Process Temperature [K]',
        data: paginatedData.map(row => parseFloat(row['Process temperature [K]'] || 0)),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Rotational Speed [rpm]',
        data: paginatedData.map(row => parseFloat(row['Rotational speed [rpm]'] || 0)),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'Torque [Nm]',
        data: paginatedData.map(row => parseFloat(row['Torque [Nm]'] || 0)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tool Wear [min]',
        data: paginatedData.map(row => parseFloat(row['Tool wear [min]'] || 0)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column}
                onClick={() => handleSort(column)}
                className={getColumnClass(column)}
              >
                {column}
                {sortConfig?.key === column ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : null}
              </th>
            ))}
          </tr>
          <tr className="filter-row">
            {columns.map(column => (
              <th key={column}>
                <input
                  type="text"
                  placeholder={`Filter by ${column}`}
                  value={filters[column] || ''}
                  onChange={(e) => handleFilterChange(column, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index} onClick={() => handleRowClick(row)} className="clickable-row">
              {columns.map(column => (
                <td key={column} className={getColumnClass(column)}>
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
      {selectedRow && (
        <div className="row-details">
          <h2 className="details-title">Row Details</h2>
          <ul className="details-list">
            {columns.map(column => (
              <li key={column} className="details-item">
                <strong>{column}:</strong> {selectedRow[column]}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="charts24">
        <h2>Data Visualization</h2>
        <div className="chart-container24">
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
};

export default DataTable;

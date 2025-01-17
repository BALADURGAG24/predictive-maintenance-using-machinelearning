import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Css/SensorData.css';

const SensorData = () => {
  const [formData, setFormData] = useState({
    airTemperature: '',
    processTemperature: '',
    rotationalSpeed: '',
    torque: '',
    toolWear: '',
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [prediction, setPrediction] = useState('');
  const [insights, setInsights] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://255a-34-45-35-237.ngrok-free.app/predict', {
        features: [
          parseFloat(formData.airTemperature),
          parseFloat(formData.processTemperature),
          parseFloat(formData.rotationalSpeed),
          parseFloat(formData.torque),
          parseFloat(formData.toolWear),
        ],
      });

      setPrediction(response.data.predicted_failure_type);
      setInsights(response.data.insights);
      setSubmittedData([...submittedData, formData]);

      setFormData({
        airTemperature: '',
        processTemperature: '',
        rotationalSpeed: '',
        torque: '',
        toolWear: '',
      });
    } catch (error) {
      console.error('Error submitting data:', error.response ? error.response.data : error.message);
    }
  };

  const createChartData = (field) => ({
    labels: submittedData.map((_, index) => `Entry ${index + 1}`),
    datasets: [
      {
        label: field,
        data: submittedData.map(data => parseFloat(data[field])),
        fill: false,
        backgroundColor: '#4e73df',
        borderColor: '#4e73df',
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  });

  return (
    <div className="sensor-data-container">
      <div className="form-and-details">
        <form onSubmit={handleSubmit} className="sensor-data-form">
          <div className="form-section">
            <h2>Input Data</h2>
            <div className="input-grid">
              {Object.keys(formData).map((key) => (
                <div key={key} className="input-box">
                  <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="submit-button">Submit</button>
          </div>
        </form>

        {submittedData.length > 0 && (
          <div className="submitted-data">
            <h2>Submitted Data</h2>
            <div className="data-grid">
              {submittedData.map((data, index) => (
                <div key={index} className="data-box">
                  <h3>Entry {index + 1}</h3>
                  {Object.keys(data).map((key) => (
                    <p key={key}><strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {data[key]}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {prediction && (
          <div className="prediction">
            <h2>Predicted Failure Type</h2>
            <p>{prediction}</p>
            <button 
              className="insights-button"
              onClick={() => navigate('/insights', {
                state: { failureType: prediction, insights }
              })}
            >
              View Insights
            </button>
          </div>
        )}
      </div>

      <div className="charts">
        {['airTemperature', 'processTemperature', 'rotationalSpeed', 'torque', 'toolWear'].map((field) => (
          <div key={field} className="chart-container">
            <Line data={createChartData(field)} options={{ maintainAspectRatio: false }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorData;

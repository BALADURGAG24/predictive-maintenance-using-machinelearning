import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Jsx/SideBar';
import loadingGif from './Assets/loading.webp';  // Import the loading GIF

// Lazy load the components
const Home = lazy(() => import('./Components/Jsx/Home'));
const Type = lazy(() => import('./Components/Jsx/Type'));
const Target = lazy(() => import('./Components/Jsx/Target'));
const FailureType = lazy(() => import('./Components/Jsx/FailureType'));
const TemperatureWear = lazy(() => import('./Components/Jsx/TemperatureAnalysis'));
const MachineMetrics = lazy(() => import('./Components/Jsx/AllData'));
const Details = lazy(() => import('./Components/Jsx/Details'));
const DataTable = lazy(() => import('./Components/Jsx/DataTable'));
const SensorData = lazy(() => import('./Components/Jsx/SensorData'));
const Insights = lazy(() => import('./Components/Jsx/Insights'));

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '250px', width: '100%' }}>
          <Suspense 
            fallback={
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}>
                <img src={loadingGif} alt="Loading..." />
              </div>
            }
          >
            <Routes>
              <Route path="/table-data" element={<MachineMetrics />} />
              <Route path="/type" element={<Type />} />
              <Route path="/target" element={<Target />} />
              <Route path="/failure-type" element={<FailureType />} />
              <Route path="/" element={<Home />} />
              <Route path="/temperature-data" element={<TemperatureWear />} />
              <Route path="/Details" element={<Details />} />
              <Route path="/DataTable" element={<DataTable />} />
              <Route path="/SensorData" element={<SensorData />} />
              <Route path="/Insights" element={<Insights />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
};

export default App;

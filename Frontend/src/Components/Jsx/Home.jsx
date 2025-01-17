import React from 'react';
import FailureType from './FailureType';
import TemperatureWear from './TemperatureAnalysis';
import Type from './Type';
import Target from './Target';
import MachineMetrics from './AllData';
import '../Css/Home.css';  // Importing the CSS file

function Home() {
  
  return (
    <div className="container">
      <h1>Predictive Maintenance Dashboard</h1>

      <section>
        <MachineMetrics />
      </section>

      <section>
        <FailureType />
      </section>

      <section>
        <Type />
      </section>

      <section>
        <Target />
      </section>

      <section>
        <TemperatureWear />
      </section>
    </div>
  );
}

export default Home;

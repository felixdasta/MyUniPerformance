import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div>
        <h1>Sandunga</h1>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}

export default App;

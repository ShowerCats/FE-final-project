import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Info from './Info';
import Help from './Help';
import Forms from './Forms';
import Management from './Management';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/help" element={<Help />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/management" element={<Management />} />
      </Routes>
    </Router>
  );
}

export default App;

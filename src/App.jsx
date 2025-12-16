import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import LiveScores from './components/LiveScores';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

const App = () => {
  const [selectedSport, setSelectedSport] = useState(null);

  const handleSportSelect = (sport) => {
      setSelectedSport(sport);
  };

  return (
    <Router>
      {/* Navbar is outside Routes so it remains visible */}
      <Navbar onSportSelect={handleSportSelect}/>
      
      <main id="main-content">
        <Routes>
          {/* Home Route: Displays the scores */}
          <Route path="/" element={<LiveScores selectedSport={selectedSport}/>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
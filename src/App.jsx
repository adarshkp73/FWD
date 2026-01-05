import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import LiveScores from './components/LiveScores';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile'; // New Import
import './App.css';

const App = () => {
  // 1. Initialize state from localStorage if available
  const [selectedSport, setSelectedSport] = useState(() => {
    return localStorage.getItem('selectedSport') || null;
  });

  const handleSportSelect = (sport) => {
      setSelectedSport(sport);
      // 2. Save to localStorage whenever it changes
      localStorage.setItem('selectedSport', sport);
  };

  return (
    <Router>
      <Navbar onSportSelect={handleSportSelect}/>
      
      <main id="main-content">
        <Routes>
          <Route path="/" element={<LiveScores selectedSport={selectedSport}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* New Route for User Profile */}
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
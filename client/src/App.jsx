import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddWorkout from './components/AddWorkout';
import FastingTracker from './components/FastingTracker';
import BmiCalculator from './components/BmiCalculator';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#0e0e0e] text-white">
        <Navbar token={token} setToken={setToken} />
        <main className="container mx-auto p-4 max-w-4xl">
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!token ? <Signup setToken={setToken} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/add-workout" element={token ? <AddWorkout /> : <Navigate to="/login" />} />
            <Route path="/fasting" element={token ? <FastingTracker /> : <Navigate to="/login" />} />
            <Route path="/bmi" element={token ? <BmiCalculator /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

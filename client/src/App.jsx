import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddWorkout from './components/AddWorkout';
import FastingTracker from './components/FastingTracker';
import BmiCalculator from './components/BmiCalculator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0e0e0e] text-white">
        <Navbar />
        <main className="container mx-auto p-4 max-w-4xl">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-workout" element={<AddWorkout />} />
            <Route path="/fasting" element={<FastingTracker />} />
            <Route path="/bmi" element={<BmiCalculator />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

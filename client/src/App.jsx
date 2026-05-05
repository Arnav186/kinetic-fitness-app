import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddWorkout from './components/AddWorkout';
import BmiCalculator from './components/BmiCalculator';
import WorkoutPlanner from './components/WorkoutPlanner';
import IntervalTimer from './components/IntervalTimer';
import { ThemeProvider } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext';

function App() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto p-4 max-w-4xl">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-workout" element={<AddWorkout />} />
                <Route path="/bmi" element={<BmiCalculator />} />
                <Route path="/planner" element={<WorkoutPlanner />} />
                <Route path="/timer" element={<IntervalTimer />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </WorkoutProvider>
    </ThemeProvider>
  );
}

export default App;

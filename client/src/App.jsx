import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddWorkout from './components/AddWorkout';
import BmiCalculator from './components/BmiCalculator';
import WorkoutPlanner from './components/WorkoutPlanner';
import IntervalTimer from './components/IntervalTimer';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkoutProvider>
          <Router>
            <div className="min-h-screen">
              <Navbar />
              <main className="container mx-auto p-4 max-w-4xl">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                  } />
                  <Route path="/add-workout" element={
                    <ProtectedRoute><AddWorkout /></ProtectedRoute>
                  } />
                  <Route path="/bmi" element={
                    <ProtectedRoute><BmiCalculator /></ProtectedRoute>
                  } />
                  <Route path="/planner" element={
                    <ProtectedRoute><WorkoutPlanner /></ProtectedRoute>
                  } />
                  <Route path="/timer" element={
                    <ProtectedRoute><IntervalTimer /></ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </Router>
        </WorkoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


import { createContext, useState, useEffect } from 'react';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('kinetic_workouts');
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
  }, []);

  const addWorkout = (workout) => {
    const newWorkout = { ...workout, _id: Date.now().toString(), date: new Date().toISOString() };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    localStorage.setItem('kinetic_workouts', JSON.stringify(updated));
  };

  const deleteWorkout = (id) => {
    const updated = workouts.filter(w => w._id !== id);
    setWorkouts(updated);
    localStorage.setItem('kinetic_workouts', JSON.stringify(updated));
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout, deleteWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

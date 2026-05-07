import { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  setDoc,
  getDocs
} from 'firebase/firestore';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load workouts on mount/auth change
  useEffect(() => {
    if (!currentUser) {
      // Load from local storage for guests or before login
      const saved = localStorage.getItem('kinetic_workouts');
      if (saved) {
        setWorkouts(JSON.parse(saved));
      }
      setLoading(false);
      return;
    }

    // Subscribe to Firestore for logged-in user
    const q = query(
      collection(db, 'users', currentUser.uid, 'workouts'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutData = snapshot.docs.map(doc => ({
        ...doc.data(),
        _id: doc.id
      }));
      setWorkouts(workoutData);
      localStorage.setItem('kinetic_workouts', JSON.stringify(workoutData));
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const addWorkout = async (workout) => {
    const newWorkout = { 
      ...workout, 
      date: new Date().toISOString() 
    };

    if (currentUser) {
      try {
        await addDoc(collection(db, 'users', currentUser.uid, 'workouts'), newWorkout);
      } catch (err) {
        console.error("Error adding workout to cloud:", err);
      }
    } else {
      // Local fallback
      const updated = [{ ...newWorkout, _id: Date.now().toString() }, ...workouts];
      setWorkouts(updated);
      localStorage.setItem('kinetic_workouts', JSON.stringify(updated));
    }
  };

  const deleteWorkout = async (id) => {
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'workouts', id));
      } catch (err) {
        console.error("Error deleting workout from cloud:", err);
      }
    } else {
      // Local fallback
      const updated = workouts.filter(w => w._id !== id);
      setWorkouts(updated);
      localStorage.setItem('kinetic_workouts', JSON.stringify(updated));
    }
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout, deleteWorkout, loading }}>
      {children}
    </WorkoutContext.Provider>
  );
};


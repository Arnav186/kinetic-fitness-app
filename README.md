#  Kinetic Fitness App

A modern, full-stack fitness tracking web application built with **React**, **Firebase Authentication**, and **Cloud Firestore**. Track your workouts, monitor your progress, and keep your data synced across all devices.

---

##   Live Demo

> [https://kinetic-fitness-app.vercel.app](https://kinetic-fitness-app.vercel.app)

---

##  Features

-  **User Authentication** — Secure Sign Up / Sign In via Firebase Auth
-  **Cloud Data Sync** — Workout logs saved to Firestore, synced in real-time across devices
-  **Dashboard** — Visual overview of total calories burned, workout streaks, and weekly charts
-  **Workout Logger** — Log workouts with name, duration, and calories
-  **Workout Planner** — Weekly planner with goal-based exercise recommendations
-  **HIIT Interval Timer** — Multi-phase pro timer with audio feedback
-  **BMI Calculator** — Track your Body Mass Index
-  **Dark / Light Mode** — Fully themed UI that respects your preference
-  **Fully Responsive** — Optimized for mobile and desktop

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, CSS |
| Routing | React Router DOM v7 |
| Authentication | Firebase Auth (Email/Password) |
| Database | Firebase Cloud Firestore |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

---

##  Project Structure

```
kinetic-fitness-app/
├── client/
│   ├── public/
│   │   └── avatar.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx          # Auth UI
│   │   │   ├── ProtectedRoute.jsx # Route guard
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddWorkout.jsx
│   │   │   ├── BmiCalculator.jsx
│   │   │   ├── WorkoutPlanner.jsx
│   │   │   └── IntervalTimer.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Firebase Auth state
│   │   │   ├── WorkoutContext.jsx # Firestore sync
│   │   │   └── ThemeContext.jsx
│   │   ├── firebase.js            # Firebase initialization
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env                       # Local secrets (not committed)
│   └── package.json
└── README.md
```

---

<p align="center">Built with and Firebase by <a href="https://github.com/Arnav186">Arnav186</a></p>

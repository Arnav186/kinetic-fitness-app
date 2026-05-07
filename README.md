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
| Frontend | React 19, Vite, TailwindCSS v4 |
| Routing | React Router DOM v7 |
| Authentication | Firebase Auth (Email/Password) |
| Database | Firebase Cloud Firestore |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

---

##  Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/Arnav186/kinetic-fitness-app.git
cd kinetic-fitness-app/client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Email/Password** under **Authentication → Sign-in method**.
3. Create a **Cloud Firestore** database.
4. Copy your Firebase config from **Project Settings → Web App**.

### 4. Configure Environment Variables

Create a `.env` file inside the `client/` directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

>  **Never commit your `.env` file to GitHub.** It is already in `.gitignore`.

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

##  Firestore Security Rules

Paste these rules in your **Firestore → Rules** tab to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

##  Deployment (Vercel)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Set **Root Directory** to `client`.
4. Add all your environment variables from `.env` in the Vercel dashboard.
5. Click **Deploy**.

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

##  Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with and Firebase by <a href="https://github.com/Arnav186">Arnav186</a></p>

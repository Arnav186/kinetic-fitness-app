const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

router.post('/add', auth, async (req, res) => {
  const { name, duration, calories } = req.body;
  if (!name || duration == null || calories == null) return res.status(400).json({ msg: 'Please provide all fields' });

  try {
    const newWorkout = new Workout({ user: req.user.id, name, duration, calories });
    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/history', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

router.post('/add', async (req, res) => {
  const { name, duration, calories } = req.body;
  if (!name || duration == null || calories == null) return res.status(400).json({ msg: 'Please provide all fields' });

  try {
    const newWorkout = new Workout({ name, duration, calories });
    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) { res.status(500).json({msg: 'Workout Error: ' + err.message}); }
});

router.get('/history', async (req, res) => {
  try {
    // Return all workouts globally without user filter
    const workouts = await Workout.find({}).sort({ date: -1 });
    res.json(workouts);
  } catch (err) { res.status(500).json({msg: 'Workout Error: ' + err.message}); }
});

router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ msg: 'Workout not found' });
    res.json({ msg: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Workout Error: ' + err.message });
  }
});

module.exports = router;

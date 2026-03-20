const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Fasting = require('../models/Fasting');

router.post('/start', auth, async (req, res) => {
  try {
    // Check if active fast
    let activeFast = await Fasting.findOne({ user: req.user.id, status: 'active' });
    if(activeFast) return res.status(400).json({msg: "You already have an active fast"});
    const newFast = new Fasting({ user: req.user.id, startTime: new Date() });
    await newFast.save();
    res.json(newFast);
  } catch(err) { res.status(500).send('Server Error'); }
});

router.post('/stop', auth, async (req, res) => {
  try {
    let activeFast = await Fasting.findOne({ user: req.user.id, status: 'active' });
    if(!activeFast) return res.status(400).json({msg: "No active fast found"});
    activeFast.status = 'completed';
    activeFast.endTime = new Date();
    await activeFast.save();
    res.json(activeFast);
  } catch (err) { res.status(500).json({msg: 'Fast Error: ' + err.message}); }
});

router.get('/status', auth, async (req, res) => {
  try {
    const activeFast = await Fasting.findOne({ user: req.user.id, status: 'active' });
    if(activeFast) {
      res.json({ active: true, startTime: activeFast.startTime });
    } else {
      res.json({ active: false });
    }
  } catch (err) { res.status(500).json({msg: 'Fast Error: ' + err.message}); }
});

router.get('/history', auth, async (req, res) => {
  try {
    const history = await Fasting.find({ user: req.user.id, status: 'completed' }).sort({ startTime: -1 });
    res.json(history);
  } catch(err) { res.status(500).send('Server Error'); }
});

module.exports = router;

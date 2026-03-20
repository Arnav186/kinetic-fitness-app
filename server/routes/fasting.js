const express = require('express');
const router = express.Router();
const Fasting = require('../models/Fasting');

router.post('/start', async (req, res) => {
  try {
    let activeFast = await Fasting.findOne({ status: 'active' });
    if(activeFast) return res.status(400).json({msg: "You already have an active fast"});
    const newFast = new Fasting({ startTime: new Date() });
    await newFast.save();
    res.json(newFast);
  } catch(err) { res.status(500).json({msg: 'Fast Error: ' + err.message}); }
});

router.post('/stop', async (req, res) => {
  try {
    let activeFast = await Fasting.findOne({ status: 'active' });
    if(!activeFast) return res.status(400).json({msg: "No active fast found"});
    activeFast.status = 'completed';
    activeFast.endTime = new Date();
    await activeFast.save();
    res.json(activeFast);
  } catch (err) { res.status(500).json({msg: 'Fast Error: ' + err.message}); }
});

router.get('/status', async (req, res) => {
  try {
    const activeFast = await Fasting.findOne({ status: 'active' });
    if(activeFast) {
      res.json({ active: true, startTime: activeFast.startTime });
    } else {
      res.json({ active: false });
    }
  } catch (err) { res.status(500).json({msg: 'Fast Error: ' + err.message}); }
});

router.get('/history', async (req, res) => {
  try {
    const history = await Fasting.find({ status: 'completed' }).sort({ startTime: -1 });
    res.json(history);
  } catch(err) { res.status(500).json({msg: 'Fast Error: ' + err.message}); }
});

module.exports = router;

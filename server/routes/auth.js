const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({msg: 'Enter all fields'});
  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({msg: 'Missing JWT_SECRET in Environment Variables!'});
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) return res.status(500).json({ msg: 'JWT Error: ' + err.message });
      res.json({ token, user: {id: user.id, name: user.name, email: user.email} });
    });
  } catch (err) { res.status(500).json({msg: 'Auth Error: ' + err.message}); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({msg: 'Enter all fields'});
  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({msg: 'Missing JWT_SECRET in Environment Variables!'});
    
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
    
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) return res.status(500).json({ msg: 'JWT Error: ' + err.message });
      res.json({ token, user: {id: user.id, name: user.name, email: user.email} });
    });
  } catch (err) { res.status(500).json({msg: 'Auth Error: ' + err.message}); }
});

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({msg: 'Server Error: ' + err.message}); }
});

module.exports = router;

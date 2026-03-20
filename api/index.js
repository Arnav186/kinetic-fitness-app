const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log('MongoDB Connection error:', error);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/workout', require('../server/routes/workout'));
app.use('/api/fast', require('../server/routes/fasting'));

module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;
let dbError = null;

const connectDB = async () => {
  if (isConnected) return;
  try {
    // 5-second timeout so it properly throws the error if the password/URI is wrong
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState;
    dbError = null;
  } catch (error) {
    dbError = error.message;
    console.log('MongoDB Connection error:', error);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  if (!isConnected) {
    return res.status(500).json({ msg: 'Atlas DB Error: ' + (dbError || 'Unknown connection issue') });
  }
  next();
});

app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/workout', require('../server/routes/workout'));
app.use('/api/fast', require('../server/routes/fasting'));

module.exports = app;

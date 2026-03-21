const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, error: null };
}

const connectDB = async () => {
  // If the connection is fully established, return immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Prevents Mongoose from buffering operations when disconnected, throws error instantly instead
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch(error => {
      cached.promise = null; // reset if connection failed to allow retries
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.error = null;
  } catch (error) {
    cached.error = error.message;
    console.log('MongoDB Connection error:', error);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  
  // Verify that the actual connection is established and healthy
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ msg: 'Atlas DB Error: ' + (cached.error || 'Unknown connection issue') });
  }
  
  next();
});

app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/workout', require('../server/routes/workout'));
app.use('/api/fast', require('../server/routes/fasting'));

module.exports = app;

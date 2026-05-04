require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ extended: false }));

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas Connected Locally');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
}

connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/workout', require('./routes/workout'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

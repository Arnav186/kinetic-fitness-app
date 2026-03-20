require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ extended: false }));

const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
  console.log('In-Memory MongoDB Connected');
}

connectDB();

app.use('/auth', require('./routes/auth'));
app.use('/workout', require('./routes/workout'));
app.use('/fast', require('./routes/fasting'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

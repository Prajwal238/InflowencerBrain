const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
// const { createInfluencerMockData } = require('./models/getInfluencerModel');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/influencer_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// createInfluencerMockData();

const restPath = path.join(__dirname, 'src', 'rest');
fs.readdirSync(restPath).forEach(file => {
  if (file.endsWith('.js')) {
    const route = require(path.join(restPath, file));
    app.use('/api', route);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
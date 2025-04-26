require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const classRoutes = require('./routes/classRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // 📈 Increase JSON limit
app.use(express.urlencoded({ extended: true, limit: '50mb' }));  // 📈 Increase form limit

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/classes', classRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

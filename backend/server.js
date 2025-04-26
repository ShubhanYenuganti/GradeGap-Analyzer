const dotenv = require('dotenv');
dotenv.config(); // <-- VERY FIRST THING

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const classRoutes = require('./routes/classRoutes');
const geminiRoutes = require('./routes/gemini');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api/classes', classRoutes);
app.use('/api/gemini', geminiRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

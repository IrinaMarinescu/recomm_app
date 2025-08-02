const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const qrCodeRoutes = require('./routes/qrCode');
const recommendationRoutes = require('./routes/recommendations');
const auth = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/recomm_app';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/qrcode', qrCodeRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Protected route example
app.get('/api/protected', auth, (req, res) => {
  res.json({ 
    message: 'This is a protected route',
    user: req.user.toJSON()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
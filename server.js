const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const citiesRouter = require('./routes/cities');

const app = express();

// Middleware - CORS Configuration untuk Flutter Web
app.use(cors({
  origin: '*', // Allow all origins untuk development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/cities', citiesRouter);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/Auth'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend Payung Teduh API',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Terjadi kesalahan pada server',
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📚 Database: ${process.env.MONGO_URI}`);
});
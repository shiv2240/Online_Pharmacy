const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const chargeRoutes = require('./routes/charge'); // Import the charge route
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/charge', chargeRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

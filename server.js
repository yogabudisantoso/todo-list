const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/items', itemRoutes);
app.use('/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('To-Do List API is running');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
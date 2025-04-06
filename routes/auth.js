const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validators');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
router.post('/register', registerValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "User already exists",
        data: null
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.status(201).json({ 
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: result.insertId,
          email: email
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Invalid credentials",
        data: null
      });
    }

    const user = users[0];

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        status: "error", 
        message: "Invalid credentials",
        data: null
      });
    }

    // Create and sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email
        },
        token: token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user profile (protected route)
router.get('/profile', auth, async (req, res, next) => {
  try {
    const [users] = await db.query('SELECT id, email, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.json(users[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
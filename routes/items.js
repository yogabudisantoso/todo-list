const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const { itemValidation } = require('../middleware/validators');

// GET all items (for authenticated user)
router.get('/', auth, async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM items WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET a specific item by ID (for authenticated user)
router.get('/:id', auth, async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?', 
      [req.params.id, req.user.id]
    );
    
    if (rows.length === 0) {
      const error = new Error('Item not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST a new item (for authenticated user)
router.post('/', auth, itemValidation, async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO items (name, description, status, user_id) VALUES (?, ?, ?, ?)',
      [name, description, status || 'pending', req.user.id]
    );
    
    res.status(201).json({ 
      message: 'Item created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    next(error);
  }
});

// PUT (update) an item (for authenticated user)
router.put('/:id', auth, itemValidation, async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const id = req.params.id;
    
    // Check if item exists and belongs to the user
    const [checkResult] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?', 
      [id, req.user.id]
    );
    
    if (checkResult.length === 0) {
      const error = new Error('Item not found or not authorized');
      error.statusCode = 404;
      throw error;
    }
    
    await db.query(
      'UPDATE items SET name = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [name, description, status, id, req.user.id]
    );
    
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE an item (for authenticated user)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id;
    
    // Check if item exists and belongs to the user
    const [checkResult] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?', 
      [id, req.user.id]
    );
    
    if (checkResult.length === 0) {
      const error = new Error('Item not found or not authorized');
      error.statusCode = 404;
      throw error;
    }
    
    await db.query('DELETE FROM items WHERE id = ? AND user_id = ?', [id, req.user.id]);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
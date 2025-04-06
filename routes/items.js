const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET all items (for authenticated user)
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET a specific item by ID (for authenticated user)
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?', 
      [req.params.id, req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST a new item (for authenticated user)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO items (name, description, status, user_id) VALUES (?, ?, ?, ?)',
      [name, description, status || 'pending', req.user.id]
    );
    
    res.status(201).json({ 
      message: 'Item created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT (update) an item (for authenticated user)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const id = req.params.id;
    
    // Check if item exists and belongs to the user
    const [checkResult] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?', 
      [id, req.user.id]
    );
    
    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    await db.query(
      'UPDATE items SET name = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [name, description, status, id, req.user.id]
    );
    
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE an item (for authenticated user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if item exists and belongs to the user
    const [checkResult] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?', 
      [id, req.user.id]
    );
    
    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    await db.query('DELETE FROM items WHERE id = ? AND user_id = ?', [id, req.user.id]);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all items
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET a specific item by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST a new item
router.post('/', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO items (name, description, status) VALUES (?, ?, ?)',
      [name, description, status || 'pending']
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

// PUT (update) an item
router.put('/:id', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const id = req.params.id;
    
    // Check if item exists
    const [checkResult] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await db.query(
      'UPDATE items SET name = ?, description = ?, status = ? WHERE id = ?',
      [name, description, status, id]
    );
    
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE an item
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if item exists
    const [checkResult] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await db.query('DELETE FROM items WHERE id = ?', [id]);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
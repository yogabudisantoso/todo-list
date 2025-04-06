const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const { itemValidation } = require('../middleware/validators');

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the item
 *         name:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: The description of the item
 *         status:
 *           type: string
 *           description: The status of the item
 *           enum: [pending, in_progress, completed]
 *         user_id:
 *           type: integer
 *           description: The user id who owns this item
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the item was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the item was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Todo items management
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items with pagination
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Items retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Finish project
 *                       description:
 *                         type: string
 *                         example: Complete backend API
 *                       status:
 *                         type: string
 *                         example: pending
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-04-05T12:00:00.000Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 10
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get a specific item by ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Item name
 *               description:
 *                 type: string
 *                 description: Item description
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 default: pending
 *                 description: Item status
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Todo item created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Finish project
 *                     description:
 *                       type: string
 *                       example: Complete backend API
 *                     status:
 *                       type: string
 *                       example: pending
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-04-05T12:00:00.000Z
 *                     userId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Item name
 *               description:
 *                 type: string
 *                 description: Item description
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 description: Item status
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item not found or not authorized
 */

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item not found or not authorized
 */

// GET all items (for authenticated user) with pagination
router.get('/', auth, async (req, res, next) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Get total count of items for the user
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM items WHERE user_id = ?', 
      [req.user.id]
    );
    const total = countResult[0].total;
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    // Get paginated items
    const [rows] = await db.query(
      'SELECT * FROM items WHERE user_id = ? LIMIT ? OFFSET ?', 
      [req.user.id, limit, offset]
    );
    
    // Format the items to match the requested structure
    const formattedItems = rows.map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      status: item.status,
      createdAt: item.created_at
    }));
    
    // Return paginated response with metadata
    res.json({
      status: "success",
      message: "Items retrieved successfully",
      data: formattedItems,
      pagination: {
        total,
        page,
        totalPages,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
});

// The rest of the routes remain unchanged
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
    
    // Fetch the newly created item to include in response
    const [items] = await db.query(
      'SELECT id, name, description, status, created_at, user_id FROM items WHERE id = ?',
      [result.insertId]
    );
    
    const item = items[0];
    
    res.status(201).json({ 
      status: "success",
      message: "Todo item created successfully",
      data: {
        id: item.id,
        title: item.name,
        description: item.description,
        status: item.status,
        createdAt: item.created_at,
        userId: item.user_id
      }
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
// Routes/categoryRoutes.js

const express = require('express');
const { createCategory } = require('../controllers/CategoryController');
const router = express.Router();

// Create category route
router.post('/createCategory', createCategory);

// You can add more category-related routes here (e.g., get categories, update categories, etc.)

module.exports = router;

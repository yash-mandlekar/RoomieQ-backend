// Routes/categoryRoutes.js

const express = require('express');
const { createCity } = require('../controllers/cityController');
const router = express.Router();

// Create category route
router.post('/createCity', createCity);

// You can add more category-related routes here (e.g., get categories, update categories, etc.)

module.exports = router;

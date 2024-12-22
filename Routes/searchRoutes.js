// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchDatabase } = require('../controllers/searchController');

router.get('/search', searchDatabase);

module.exports = router;

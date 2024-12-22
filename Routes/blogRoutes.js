// Routes/blogRoutes.js

const express = require('express');
const { createBlog } = require('../controllers/blogController');
const router = express.Router();

// Create blog route
router.post('/createBlog', createBlog);

// You can add more blog-related routes here (e.g., get blogs, update blogs, etc.)

module.exports = router;

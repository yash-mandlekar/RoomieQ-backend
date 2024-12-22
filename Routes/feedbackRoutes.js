// Routes/feedbackRoutes.js

const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController'); // Ensure this path is correct
const router = express.Router();

// Submit feedback route
router.post('/submit-feedback', submitFeedback);

// You can add more feedback-related routes here (e.g., get feedback, delete feedback, etc.)

module.exports = router;

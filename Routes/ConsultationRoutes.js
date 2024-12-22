const express = require('express');
const { CreateConsultation } = require('../controllers/ConsultationController');
const router = express.Router();

// Create consultation route
router.post('/createConsultation', CreateConsultation);

// Export the router
module.exports = router;

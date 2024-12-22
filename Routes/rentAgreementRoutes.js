const express = require('express');
const router = express.Router();
const rentAgreementController = require('../controllers/rentAgreementController');

// Route to create a new rent agreement
router.post('/rent-agreements', rentAgreementController.createRentAgreement);

// Route to get all rent agreements
router.get('/rent-agreements', rentAgreementController.getAllRentAgreements);

// Route to get a rent agreement by ID
router.get('/rent-agreements/:id', rentAgreementController.getRentAgreementById);

// Route to update a rent agreement by ID
router.put('/rent-agreements/:id', rentAgreementController.updateRentAgreement);

// Route to delete a rent agreement by ID
router.delete('/rent-agreements/:id', rentAgreementController.deleteRentAgreement);

module.exports = router;

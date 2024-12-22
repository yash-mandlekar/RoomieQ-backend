const express = require('express');
const router = express.Router();
const bhojnalayaController = require('../controllers/bhojnalayaController');
const isAuthenticated = require('../middleware/auth');
const checkListingLimit = require('../middleware/checkListingLimit');

// Route to create a new Bhojnalaya listing
router.post('/Createbhojnalayas',isAuthenticated,checkListingLimit, bhojnalayaController.createBhojnalaya);

// Route to get all Bhojnalaya listings
router.get('/bhojnalayas', bhojnalayaController.getAllBhojnalayas);

// Route to get a Bhojnalaya listing by ID
router.get('/bhojnalayas/:id', bhojnalayaController.getBhojnalayaById);

// Route to update a Bhojnalaya listing by ID
router.put('/bhojnalayas/:id', bhojnalayaController.updateBhojnalaya);

// Route to delete a Bhojnalaya listing by ID
router.delete('/bhojnalayas/:id', bhojnalayaController.deleteBhojnalaya);

module.exports = router;

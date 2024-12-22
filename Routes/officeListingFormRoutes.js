const express = require('express');
const router = express.Router();
const officeListingController = require('../controllers/officeListingFormController');
const isAuthenticated = require('../middleware/auth');
const checkListingLimit = require('../middleware/checkListingLimit');

// Route to create a new office listing
router.post('/office-listings',isAuthenticated,checkListingLimit, officeListingController.createOfficeListing);

// Route to get all office listings
router.get('/office-listings', officeListingController.getAllOfficeListings);

// Route to get an office listing by ID
router.get('/office-listings/:id', officeListingController.getOfficeListingById);

// Route to update an office listing by ID
router.put('/office-listings/:id', officeListingController.updateOfficeListing);

// Route to delete an office listing by ID
router.delete('/office-listings/:id', officeListingController.deleteOfficeListing);

module.exports = router;

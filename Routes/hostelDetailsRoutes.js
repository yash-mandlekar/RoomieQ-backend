const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelDetailsController');
const isAuthenticated = require('../middleware/auth');
const checkListingLimit = require('../middleware/checkListingLimit');

// Route to create a new hostel listing
router.post('/Createhostels',isAuthenticated,checkListingLimit, hostelController.createHostel);

// Route to get all hostels
router.get('/hostels', hostelController.getAllHostels);

// Route to get a hostel by ID
router.get('/hostels/:id', hostelController.getHostelById);

// Route to update a hostel by ID
router.put('/hostels/:id', hostelController.updateHostel);

// Route to delete a hostel by ID
router.delete('/hostels/:id', hostelController.deleteHostel);

module.exports = router;

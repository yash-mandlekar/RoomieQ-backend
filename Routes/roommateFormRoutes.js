const express = require('express');
const router = express.Router();
const roommateController = require('../controllers/roommateFormController');
const isAuthenticated = require('../middleware/auth');
const checkListingLimit = require('../middleware/checkListingLimit');

// Route to create a new roommate listing
router.post('/create-roommate',isAuthenticated,checkListingLimit, roommateController.createRoommate);

// Route to get all roommate listings
router.get('/roommates', roommateController.getAllRoommates);

// Route to get a roommate listing by ID
router.get('/roommates/:id', roommateController.getRoommateById);

// Route to update a roommate listing by ID
router.put('/roommates/:id', roommateController.updateRoommate);

// Route to delete a roommate listing by ID
router.delete('/roommates/:id', roommateController.deleteRoommate);

module.exports = router;

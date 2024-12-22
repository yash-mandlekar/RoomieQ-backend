const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const isAuthenticated = require('../middleware/auth');
const checkListingLimit = require('../middleware/checkListingLimit');

// Route to create a new roommate listing
router.post('/create-room',isAuthenticated,checkListingLimit, roomController.createRoom);

// Route to get all room listings
router.get('/rooms', roomController.getAllRooms);

// Route to get all room listings with filters
router.post('/filter/rooms', roomController.getFilterRooms);

// Route to get a room listing by ID
router.get('/rooms/:id', roomController.getRoomById);

// Route to update a room listing by ID
router.put('/rooms/:id', roomController.updateRoom);

// Route to delete a room listing by ID
router.delete('/rooms/:id', roomController.deleteRoom);

module.exports = router;

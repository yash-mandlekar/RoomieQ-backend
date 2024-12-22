const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route to create a new notification
router.post('/notifications', notificationController.createNotification);

// Route to get all notifications
router.get('/notifications', notificationController.getAllNotifications);

// Route to get a notification by ID
router.get('/notifications/:id', notificationController.getNotificationById);

// Route to update a notification by ID
router.put('/notifications/:id', notificationController.updateNotification);

// Route to delete a notification by ID
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;

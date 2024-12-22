const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    UserUid: { type: String, required: true },
    NotificationTitle: { type: String, required: true },
    NotificationDes: { type: String, required: true },
    NotificationUid: { type: String, required: true, unique: true },
    NotificationImage: { type: String, default: 'No image provided' }, // URL of the notification image
    NotificationDate: { type: Date, default: Date.now }, // Current date as default
    NotificationTime: { type: String, default: () => new Date().toLocaleTimeString() } // Current time as default
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Notification', notificationSchema);

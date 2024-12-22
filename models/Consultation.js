const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    PhoneNo: { type: String, required: true },
    Time: { type: String, default: () => new Date().toLocaleTimeString() }, // Store time as a formatted string
    Date: { type: Date, default: Date.now }, // Default to the current date
    Uid: { type: String, required: true } // Unique identifier for the user
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Consultation', consultationSchema);

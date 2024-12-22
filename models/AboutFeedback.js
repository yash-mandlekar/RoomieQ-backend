// models/AboutFeedback.js
const mongoose = require('mongoose');

const aboutFeedbackSchema = new mongoose.Schema({
    Uid: { type: String, required: true }, // Unique identifier for the user
    Feedback: { type: String, required: true }, // The feedback message
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model('AboutFeedback', aboutFeedbackSchema);

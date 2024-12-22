// models/Category.js
const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    CityName: { type: String, required: true },
    CityImg: { type: String, required: true }, // This can store a URL to the image
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Category', CitySchema);

// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    CategoryName: { type: String, required: true },
    CategoryImg: { type: String, required: true }, // This can store a URL to the image
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Category', categorySchema);

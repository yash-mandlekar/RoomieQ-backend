// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    BlogTitle: { type: String, required: true },
    BlogCategory: { type: String, required: true }, // You can also use an ObjectId to reference a category
    BlogImage: { type: String, required: true }, // This can store a URL to the blog image
    BlogContent: { type: String, required: true },
    BlogDate: { type: Date, default: Date.now } // Default to the current date
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Blog', blogSchema);

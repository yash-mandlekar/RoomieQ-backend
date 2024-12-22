// controllers/blogController.js

const Blog = require('../models/Blogs');

// Create blog logic
const createBlog = async (req, res) => {
    const { BlogTitle, BlogCategory, BlogImage, BlogContent, BlogDate } = req.body;

    try {
        const newBlog = new Blog({
            BlogTitle,
            BlogCategory,
            BlogImage,
            BlogContent,
            BlogDate
        });

        await newBlog.save();

        res.status(201).json({
            message: 'Blog created successfully',
            blog: newBlog
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createBlog
};

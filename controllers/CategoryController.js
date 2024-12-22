// controllers/categoryController.js

const Category = require('../models/Category');

// Create category logic
const createCategory = async (req, res) => {
    const { CategoryName, CategoryImg } = req.body;

    try {
        const newCategory = new Category({
            CategoryName,
            CategoryImg
        });

        await newCategory.save();

        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createCategory
};

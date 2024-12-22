const Property = require('../models/Property');

// Create a new property
const createProperty = async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        await newProperty.save();
        res.status(201).json({
            message: 'Property created successfully',
            property: newProperty
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all properties
const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a property
const updateProperty = async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({
            message: 'Property updated successfully',
            property: updatedProperty
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a property
const deleteProperty = async (req, res) => {
    try {
        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({
            message: 'Property deleted successfully',
            property: deletedProperty
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};// Get properties by location
const getPropertiesByLocation = async (req, res) => {
    const { location } = req.params;
    try {
        const properties = await Property.find({ Location: location });
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found for this location' });
        }
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get properties by category
const getPropertiesByCategory = async (req, res) => {
    const { category } = req.params; // Extract the category from the URL
    console.log(`Searching for properties in category: ${category}`);
    try {
        const properties = await Property.find({ CategoryType: category });
        console.log(`Found properties: ${JSON.stringify(properties)}`);
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found for this category' });
        }
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Approve a property
const approveProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({
            message: 'Property approved successfully',
            property
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Export the new methods along with existing ones
module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getPropertiesByLocation,
    getPropertiesByCategory,
    approveProperty
};

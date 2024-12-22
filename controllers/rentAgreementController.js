const RentAgreement = require('../models/RentAgreement');

// Create a new RentAgreement
const createRentAgreement = async (req, res) => {
    try {
        const newRentAgreement = new RentAgreement(req.body);
        await newRentAgreement.save();
        res.status(201).json({
            message: 'Rent agreement created successfully',
            rentAgreement: newRentAgreement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all RentAgreements
const getAllRentAgreements = async (req, res) => {
    try {
        const rentAgreements = await RentAgreement.find();
        res.status(200).json(rentAgreements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a RentAgreement by ID
const getRentAgreementById = async (req, res) => {
    try {
        const rentAgreement = await RentAgreement.findById(req.params.id);
        if (!rentAgreement) {
            return res.status(404).json({ message: 'Rent agreement not found' });
        }
        res.status(200).json(rentAgreement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a RentAgreement
const updateRentAgreement = async (req, res) => {
    try {
        const updatedRentAgreement = await RentAgreement.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedRentAgreement) {
            return res.status(404).json({ message: 'Rent agreement not found' });
        }
        res.status(200).json({
            message: 'Rent agreement updated successfully',
            rentAgreement: updatedRentAgreement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a RentAgreement
const deleteRentAgreement = async (req, res) => {
    try {
        const deletedRentAgreement = await RentAgreement.findByIdAndDelete(req.params.id);
        if (!deletedRentAgreement) {
            return res.status(404).json({ message: 'Rent agreement not found' });
        }
        res.status(200).json({
            message: 'Rent agreement deleted successfully',
            rentAgreement: deletedRentAgreement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createRentAgreement,
    getAllRentAgreements,
    getRentAgreementById,
    updateRentAgreement,
    deleteRentAgreement
};

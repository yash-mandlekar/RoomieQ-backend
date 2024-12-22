const City = require('../models/City');

// Create city logic
const createCity = async (req, res) => {
    const { CityName, CityImg } = req.body;

    try {
        const newCity = new City({ // Changed newCategory to newCity
            CityName,
            CityImg
        });

        await newCity.save();

        res.status(201).json({
            message: 'City created successfully',
            city: newCity // Corrected the response to match city data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createCity
};

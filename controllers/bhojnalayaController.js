const Bhojnalaya = require('../models/Bhojnalaya');

// Create a new Bhojnalaya listing
const createBhojnalaya = async (req, res) => {
    try {
        const newBhojnalaya = new Bhojnalaya(req.body);
        await newBhojnalaya.save();
        res.status(200).json({
            message: 'Bhojnalaya listing created successfully',
            bhojnalaya: newBhojnalaya
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all Bhojnalaya listings
const getAllBhojnalayas = async (req, res) => {
    try {
        const { filter, lat, lng } = req.query;
        let query = {};

        // If filter is provided, search by name or location
        if (filter) {
            query.$or = [
                { name: { $regex: filter, $options: 'i' } },
                { location: { $regex: filter, $options: 'i' } }
            ];
        }

        // Fetch bhojnalayas with the applied filters
        const bhojnalayas = await Bhojnalaya.find(query).populate('uid');

        if (lat && lng) {
            const R = 6371; // Radius of the Earth in kilometers
            const bhojnalayasWithDistance = bhojnalayas.map((bhojnalaya) => {
                const { latitude, longitude } = bhojnalaya.coordinates || {};
                if (latitude && longitude) {
                    const dLat = (latitude - lat) * Math.PI / 180;
                    const dLon = (longitude - lng) * Math.PI / 180;
                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat * Math.PI / 180) *
                        Math.cos(latitude * Math.PI / 180) *
                        Math.sin(dLon / 2) *
                        Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = R * c; // Distance in kilometers
                    bhojnalaya.distance = distance;
                } else {
                    bhojnalaya.distance = null;
                }
                return bhojnalaya;
            });

            // Sort bhojnalayas by distance
            bhojnalayasWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
            res.status(200).json(bhojnalayasWithDistance);
        } else {
            res.status(200).json(bhojnalayas);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get a Bhojnalaya listing by ID
const getBhojnalayaById = async (req, res) => {
    try {
        const bhojnalaya = await Bhojnalaya.findById(req.params.id).populate('uid').select('-password');;
        if (!bhojnalaya) {
            return res.status(404).json({ message: 'Bhojnalaya not found' });
        }
        res.status(200).json(bhojnalaya);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a Bhojnalaya listing
const updateBhojnalaya = async (req, res) => {
    try {
        const updatedBhojnalaya = await Bhojnalaya.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedBhojnalaya) {
            return res.status(404).json({ message: 'Bhojnalaya not found' });
        }
        res.status(200).json({
            message: 'Bhojnalaya updated successfully',
            bhojnalaya: updatedBhojnalaya
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a Bhojnalaya listing
const deleteBhojnalaya = async (req, res) => {
    try {
        const deletedBhojnalaya = await Bhojnalaya.findByIdAndDelete(req.params.id);
        if (!deletedBhojnalaya) {
            return res.status(404).json({ message: 'Bhojnalaya not found' });
        }
        res.status(200).json({
            message: 'Bhojnalaya deleted successfully',
            bhojnalaya: deletedBhojnalaya
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createBhojnalaya,
    getAllBhojnalayas,
    getBhojnalayaById,
    updateBhojnalaya,
    deleteBhojnalaya
};

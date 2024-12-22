const RoommateForm = require('../models/RoommateForm');

// Create a new Roommate Listing
const createRoommate = async (req, res) => {
    try {
        console.log(req.body);
        const newRoommate = new RoommateForm(req.body);
        
        await newRoommate.save();
        res.status(200).json({
            message: 'Roommate listing added successfully',
            roommate: newRoommate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all Roommate Listings
const getAllRoommates = async (req, res) => {
    try {
        const { filter, lat, lng } = req.query;
        let query = {};

        // If filter is provided, search by relevant fields
        if (filter) {
            query.$or = [
                { name: { $regex: filter, $options: 'i' } },
                { location: { $regex: filter, $options: 'i' } }
            ];
        }

        // Fetch roommates with applied filters
        const roommates = await RoommateForm.find(query).populate('uid');

        if (lat && lng) {
            const R = 6371; // Radius of the Earth in kilometers
            const roommatesWithDistance = roommates.map((roommate) => {
                const { latitude, longitude } = roommate.coordinates || {};
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
                    roommate.distance = distance;
                } else {
                    roommate.distance = null;
                }
                return roommate;
            });

            // Sort roommates by distance
            roommatesWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
            res.status(200).json(roommatesWithDistance);
        } else {
            res.status(200).json(roommates);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get a Roommate Listing by ID
const getRoommateById = async (req, res) => {
    try {
        const roommate = await RoommateForm.findById(req.params.id).populate('uid').select('-password');;
        if (!roommate) {
            return res.status(404).json({ message: 'Roommate listing not found' });
        }
        res.status(200).json(roommate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a Roommate Listing
const updateRoommate = async (req, res) => {
    try {
        const updatedRoommate = await RoommateForm.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedRoommate) {
            return res.status(404).json({ message: 'Roommate listing not found' });
        }
        res.status(200).json({
            message: 'Roommate listing updated successfully',
            roommate: updatedRoommate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a Roommate Listing
const deleteRoommate = async (req, res) => {
    try {
        const deletedRoommate = await RoommateForm.findByIdAndDelete(req.params.id);
        if (!deletedRoommate) {
            return res.status(404).json({ message: 'Roommate listing not found' });
        }
        res.status(200).json({
            message: 'Roommate listing deleted successfully',
            roommate: deletedRoommate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createRoommate,
    getAllRoommates,
    getRoommateById,
    updateRoommate,
    deleteRoommate
};

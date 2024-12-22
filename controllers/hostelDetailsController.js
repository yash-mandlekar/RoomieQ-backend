const HostelDetailsForm = require('../models/HostelDetailsForm');

// Create a new HostelDetailsForm
const createHostel = async (req, res) => {
    try {
        
        const newHostel = new HostelDetailsForm(req.body);
        await newHostel.save();
        res.status(200).json({
            message: 'Hostel created successfully',
            hostel: newHostel
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all Hostels
const getAllHostels = async (req, res) => {
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

        // Fetch hostels with the applied filters
        const hostels = await HostelDetailsForm.find(query).populate('uid');

        if (lat && lng) {
            const R = 6371; // Radius of the Earth in kilometers
            const hostelsWithDistance = hostels.map((hostel) => {
                const { latitude, longitude } = hostel.coordinates || {};
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
                    hostel.distance = distance;
                } else {
                    hostel.distance = null;
                }
                return hostel;
            });

            // Sort hostels by distance
            hostelsWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
            res.status(200).json(hostelsWithDistance);
        } else {
            res.status(200).json(hostels);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get a Hostel by ID
const getHostelById = async (req, res) => {
    try {
        const hostel = await HostelDetailsForm.findById(req.params.id).populate('uid').select('-password');;
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        res.status(200).json(hostel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a Hostel
const updateHostel = async (req, res) => {
    try {
        const updatedHostel = await HostelDetailsForm.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedHostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        res.status(200).json({
            message: 'Hostel updated successfully',
            hostel: updatedHostel
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a Hostel
const deleteHostel = async (req, res) => {
    try {
        const deletedHostel = await HostelDetailsForm.findByIdAndDelete(req.params.id);
        if (!deletedHostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        res.status(200).json({
            message: 'Hostel deleted successfully',
            hostel: deletedHostel
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createHostel,
    getAllHostels,
    getHostelById,
    updateHostel,
    deleteHostel
};

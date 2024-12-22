const OfficeListingForm = require('../models/OfficeListingForm');

// Create a new Office Listing
const createOfficeListing = async (req, res) => {
    try {
        const newOfficeListing = new OfficeListingForm(req.body);
        await newOfficeListing.save();
        res.status(200).json({
            message: 'Office Saved successfully',
            officeListing: newOfficeListing
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all Office Listings
const getAllOfficeListings = async (req, res) => {
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

        // Fetch office listings with the applied filters
        const officeListings = await OfficeListingForm.find(query).populate('uid');

        if (lat && lng) {
            const R = 6371; // Radius of the Earth in kilometers
            const officeListingsWithDistance = officeListings.map((officeListing) => {
                const { latitude, longitude } = officeListing.coordinates || {};
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
                    officeListing.distance = distance;
                } else {
                    officeListing.distance = null;
                }
                return officeListing;
            });

            // Sort office listings by distance
            officeListingsWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
            res.status(200).json(officeListingsWithDistance);
        } else {
            res.status(200).json(officeListings);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get an Office Listing by ID
const getOfficeListingById = async (req, res) => {
    try {
        const officeListing = await OfficeListingForm.findById(req.params.id).populate('uid').select('-password');
        if (!officeListing) {
            return res.status(404).json({ message: 'Office listing not found' });
        }
        res.status(200).json(officeListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update an Office Listing
const updateOfficeListing = async (req, res) => {
    try {
        const updatedOfficeListing = await OfficeListingForm.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedOfficeListing) {
            return res.status(404).json({ message: 'Office listing not found' });
        }
        res.status(200).json({
            message: 'Office listing updated successfully',
            officeListing: updatedOfficeListing
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete an Office Listing
const deleteOfficeListing = async (req, res) => {
    try {
        const deletedOfficeListing = await OfficeListingForm.findByIdAndDelete(req.params.id);
        if (!deletedOfficeListing) {
            return res.status(404).json({ message: 'Office listing not found' });
        }
        res.status(200).json({
            message: 'Office listing deleted successfully',
            officeListing: deletedOfficeListing
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createOfficeListing,
    getAllOfficeListings,
    getOfficeListingById,
    updateOfficeListing,
    deleteOfficeListing
};

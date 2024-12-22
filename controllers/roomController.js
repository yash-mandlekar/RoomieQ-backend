const RoomForm = require("../models/RoomForm");
const cloudinary = require("../lib/cloudinary.js");

// Create a new Room Listing
const createRoom = async (req, res) => {
  try {
    const { images, ...data } = req.body;
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        uploadedImages.push(uploadResponse.secure_url);
      }
    }

    const newRoom = new RoomForm({
      ...data,
      images: uploadedImages,
    });
    await newRoom.save();
    res.status(200).json({
      message: "Room listing added successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all Room Listings
const getAllRooms = async (req, res) => {
  try {
    const { filter, lat, lng } = req.query;
    let query = {};

    // If filter is provided, search by roomName or location
    if (filter) {
      query.$or = [
        { roomName: { $regex: filter, $options: "i" } },
        { location: { $regex: filter, $options: "i" } },
      ];
    }

    // Fetch rooms with the applied filter
    const rooms = await RoomForm.find(query).populate("uid");

    if (lat && lng) {
      // Calculate distance and filter rooms based on distance
      const R = 6371; // Radius of the Earth in kilometers
      const roomsWithDistance = rooms.map((room) => {
        const { latitude, longitude } = room.coordinates || {};
        if (latitude && longitude) {
          const dLat = ((latitude - lat) * Math.PI) / 180;
          const dLon = ((longitude - lng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat * Math.PI) / 180) *
              Math.cos((latitude * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c; // Distance in kilometers
          room.distance = distance;
        } else {
          room.distance = null;
        }
        return room;
      });

      // Sort rooms by distance (ascending)
      roomsWithDistance.sort(
        (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
      );

      res.status(200).json(roomsWithDistance);
    } else {
      // If no lat and lng provided, just return the rooms filtered by name or location
      res.status(200).json(rooms);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Filtered Room Listings
const getFilterRooms = async (req, res) => {
  /* req.query:{bachelors: "Yes "
    bathroom: "2 Bathrooms"
    bedrooms: "2 Bedrooms"
    furnishing: (2) ['Semi-Furnished', 'Unfurnished']
    listedBy: ['Owner']
    pricePerSqft: {min: '100', max: '1200'}
    priceRange: {min: '0', max: '100'}
    sortBy: "Price: Low to High"}
    */
  try {
    const {
      bachelors,
      bathroom,
      bedrooms,
      furnishing,
      listedBy,
      pricePerSqft,
      priceRange,
      sortBy,
    } = req.body;
    console.log(req.body);

    let query = {};
    if (bachelors != "") query.bachelors = { $regex: bachelors, $options: "i" };
    if (bathroom != "") query.bathroom = { $regex: bathroom, $options: "i" };
    if (bedrooms != "") query.bedrooms = { $regex: bedrooms, $options: "i" };
    if (furnishing.length > 0) query.furnished = { $in: furnishing };
    if (listedBy.length > 0) query.listedBy = { $in: listedBy };
    if (pricePerSqft.max) {
      query.carpetArea = {
        $gte: pricePerSqft.min,
        $lte: pricePerSqft.max,
      };
    }
    if (priceRange.max) {
      query.monthlyMaintenance = {
        $gte: priceRange.min,
        $lte: priceRange.max,
      };
    }
    let sortQuery = {};
    if (sortBy) {
      if (sortBy === "Price: Low to High") {
        sortQuery.monthlyMaintenance = 1;
      } else if (sortBy === "Price: High to Low") {
        sortQuery.monthlyMaintenance = -1;
      } else {
        // Featured & Verified Listing
        sortQuery.isFeatured = -1;
        sortQuery.isVerified = -1;
      }
    }
    console.log(query);

    const rooms = await RoomForm.find(query).sort(sortQuery).populate("uid");
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a Room Listing by ID
const getRoomById = async (req, res) => {
  try {
    const room = await RoomForm.findById(req.params.id)
      .populate("uid")
      .select("-password");
    if (!room) {
      return res.status(404).json({ message: "Room listing not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a Room Listing
const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await RoomForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room listing not found" });
    }
    res.status(200).json({
      message: "Room listing updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a Room Listing
const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await RoomForm.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room listing not found" });
    }
    res.status(200).json({
      message: "Room listing deleted successfully",
      room: deletedRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getFilterRooms,
};

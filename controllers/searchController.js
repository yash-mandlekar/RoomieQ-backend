const Property = require("../models/Property");
const HostelDetailsForm = require("../models/HostelDetailsForm");
const Bhojnalaya = require("../models/Bhojnalaya");
const OfficeListingForm = require("../models/OfficeListingForm");
const RoommateForm = require("../models/RoommateForm");
const RoomForm = require("../models/RoomForm");

const collections = [
  Property,
  HostelDetailsForm,
  Bhojnalaya,
  OfficeListingForm,
  RoommateForm,
  RoomForm,
];

const searchDatabase = async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ message: "Query parameter 'q' is required" });
  }

  try {
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive regex for partial match
    const results = await Promise.all(
      collections.map((collection) =>
        collection
          .find({
            $or: [
              { bhojanalayName: regex },
              { hostelName: regex },
              { officeName: regex },
              { propertyType: regex },
              { roommateName: regex },
              { roomName: regex },
              { location: regex },
              { description: regex },
              // Add more fields as needed
            ],
          })
          .exec()
      )
    );

    // Flatten the results array and return
    const flattenedResults = results.flat();

    res.json(flattenedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchDatabase };

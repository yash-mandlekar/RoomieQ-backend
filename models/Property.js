const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    Parking: { type: String, required: true },
    Facing: { type: String, default: "Not specified" },
    Bedrooms: { type: String, required: true },
    userUid: { type: String, required: true },
    Bathrooms: { type: String, required: true },
    Furnished: { type: String, required: true },
    ListedBy: { type: String, default: "Owner" },
    name: { type: String, required: true }, // e.g., "1200 sqft"
    CarpetArea: { type: String, required: true }, // e.g., "1000 sqft"
    BachelorsAllowed: { type: Boolean, default: false },
    TotalFloors: { type: String, required: true },
    FloorNo: { type: String, required: true },
    Location: { type: String, required: true },
    DatePosted: { type: Date, default: Date.now },
    Price: { type: String, required: true },
    title: { type: String, required: true },
    advanceAmount: { type: String, required: true },
    PropertyDescription: { type: String, default: "No description provided" },
    propertyImages: [{ type: String }], // Array of URLs
    CategoryType: { type: String, default: "Flat" }, // e.g., "Apartment", "Villa"
    GenderType: { type: String, required: true }, // e.g., "Male", "Female", "Unspecified"
    Amenities: [{ type: String }], // e.g., ["Gym", "Swimming Pool", "Parking"]
    PropertyUid: { type: String, required: true, unique: true },
    isApproved: { type: Boolean, default: false },
    FeatureListing: [
      {
        Uid: { type: String, required: false },
      },
    ],
    type: { type: String, default: "Property" },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model("Property", propertySchema);

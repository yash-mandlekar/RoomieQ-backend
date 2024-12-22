const mongoose = require("mongoose");

const officeListingFormSchema = new mongoose.Schema(
  {
    uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    officeName: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    title: { type: String, required: true },
    monthlyMaintenance: { type: String },
    floorNo: { type: String, required: true },
    totalFloor: { type: String, required: true },
    carpetArea: { type: String, required: true },
    facing: { type: String, required: true },
    deposit: { type: String, required: true },
    parking: { type: String, required: true },
    cabins: { type: String, required: true },
    bathroom: { type: String, required: true },
    furnished: { type: String, required: true },
    listedBy: { type: String, required: true },
    amenities: [{ type: String }],
    description: { type: String },
    isApproved: { type: Boolean, default: false },
    images: [{ type: String }],
    distance: { type: Number },
    type: { type: String, default: "Office" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OfficeListingForm", officeListingFormSchema);

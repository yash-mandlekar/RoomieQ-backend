const mongoose = require("mongoose");

const roomFormSchema = new mongoose.Schema(
  {
    uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomName: { type: String, required: true },
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
    advance: { type: String },
    bachelors: { type: String, required: true },
    bedrooms: { type: String, required: true },
    listedBy: { type: String, required: true },
    bathroom: { type: String, required: true },
    furnished: { type: String, required: true },
    parking: { type: String, required: true },
    categoryOfPeople: { type: String, required: true },
    amenities: [{ type: String }],
    description: { type: String },
    isApproved: { type: Boolean, default: false },
    images: [{ type: String }],
    distance: { type: Number },
    type: { type: String, default: "Room" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomForm", roomFormSchema);

const mongoose = require("mongoose");

const hostelDetailsFormSchema = new mongoose.Schema(
  {
    uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hostelName: { type: String, required: true },
    description: { type: String },
    rent: { type: Number, required: true },
    location: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    maintenance: { type: Number },
    timings: { type: String, required: true },
    totalFloor: { type: String },
    deposit: { type: String },
    category: { type: String, required: true },
    bathroom: { type: String, required: true },
    dining: { type: String, required: true },
    furnished: { type: String, required: true },
    parking: { type: String, required: true },
    sharing: { type: String, required: true },
    electricity: { type: String, required: true },
    visitors: { type: String, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    FeatureListing: { type: Boolean, required: true, default: false },
    isApproved: { type: Boolean, required: true, default: false },
    distance: { type: Number },
    type: { type: String, default: "Hostel" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HostelDetailsForm", hostelDetailsFormSchema);

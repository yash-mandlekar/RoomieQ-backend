const mongoose = require("mongoose");

// Define the schema for OTP
const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // Default expiry time is 5 minutes from creation
    },
    userData: {
      name: {
        type: String,
      },
      password: {
        type: String,
      },
      phoneNo: {
        type: String,
      },
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields to the document
  }
);

// Set TTL (Time-To-Live) index to automatically remove expired OTPs after the 'expires' date
OTPSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

// Create and export the OTP model
const OTPModel = mongoose.model("OTP", OTPSchema);

module.exports = OTPModel;

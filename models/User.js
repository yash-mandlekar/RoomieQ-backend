const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const purchaseSchema = new mongoose.Schema({
  purchaseDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  purchasePlan: { type: String, required: true },
  isCouponApplied: { type: Boolean, default: false },
  finalPrice: { type: Number },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String },
    uid: { type: String, required: true, unique: true },
    phoneNo: { type: String },
    password: { type: String },
    pincode: { type: String },
    address: { type: String },
    importantUserMarked: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    blockedUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "transaction" },
    ],
    purchases: [purchaseSchema],
    membership: {
      type: String,
      enum: ["Standard", "Premium", "Free"],
      default: "Free",
    },
    membershipStart: { type: Date, default: Date.now() },
    membershipEnd: {
      type: Date,
      default: function () {
        const currentDate = new Date();
        return new Date(currentDate.setDate(currentDate.getDate() + 30));
      },
    },
    membershipExpiry: {
      type: Boolean,
      default: false,
    },
    verified: { type: Boolean, default: false },
    isFeatureListing: { type: Boolean, default: false },
    listingsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ uid: this.uid }, "tttytygy", {
    expiresIn: "15d",
  });
};

module.exports = mongoose.model("User", userSchema);

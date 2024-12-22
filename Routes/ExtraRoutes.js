// In your router file (e.g., authRoutes.js)
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const checkListingLimit = require("../middleware/checkListingLimit.js");
const User = require("../models/User.js");
const HostelDetailsForm = require("../models/HostelDetailsForm.js");
const RoommateForm = require("../models/RoommateForm.js");
const RoomForm = require("../models/RoomForm.js");
const Bhojnalaya = require("../models/Bhojnalaya.js");
const OfficeForm = require("../models/OfficeListingForm.js");
const Wishlist = require("../models/Wishlist.js");

// Route for signup
router.get(
  "/addlisting",
  isAuthenticated,
  checkListingLimit,
  async (req, res) => {
    console.log("from addlisting");

    try {
      const user = await User.findById(req.user._id);
      // Logic to add listing
      user.listingsCount += 1;
      await user.save();
      res.status(201).json({ message: "Listing added successfully." });
    } catch (error) {
      res.status(500).json({ message: "Failed to add listing." });
    }
  }
);
router.get("/cancel-membership", isAuthenticated, async (req, res) => {
  try {
    const now = new Date();

    // Find users with expired memberships
    const user = await User.findOne(req.user._id);

    console.log(`Resetting membership for user: ${user.email}`);
    user.membership = "Free"; // Reset to default "Free" membership
    user.membershipStart = null;
    user.membershipEnd = null;
    user.membershipExpiry = true;
    user.isFeatureListing = false;
    user.verified = false;

    await user.save();
    res.status(201).json({ message: "Membership cancelled successfully." });
  } catch (error) {
    console.error("Error resetting memberships:", error);
  }
});

// Get listings by the logged-in user
router.get("/mylistings", isAuthenticated, async (req, res) => {
  const userId = req.user._id; // Assuming `authenticateUser` sets `req.user`

  try {
    // Fetch listings created by the user
    const hostels = await HostelDetailsForm.find({ uid: userId })
      .populate("uid")
      .lean();

    const roommates = await RoommateForm.find({ uid: userId })
      .populate("uid")
      .lean();

    const room = await RoomForm.find({ uid: userId }).populate("uid").lean();

    const bhojnalaya = await Bhojnalaya.find({ uid: userId })
      .populate("uid")
      .lean();

    const office = await OfficeForm.find({ uid: userId })
      .populate("uid")
      .lean();

    // Combine listings into a single response
    const listings = [
      ...hostels.map((item) => ({ ...item, itemType: "Hostel" })),
      ...roommates.map((item) => ({ ...item, itemType: "Roommate" })),
      ...room.map((item) => ({ ...item, itemType: "RoomForm" })),
      ...bhojnalaya.map((item) => ({ ...item, itemType: "Bhojnalaya" })),
      ...office.map((item) => ({ ...item, itemType: "Office" })),
    ];
    console.log(listings);

    res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route for deleting a listing
router.get("/delete", async (req, res) => {
  // delete all listings
  try {
    await HostelDetailsForm.deleteMany({});
    await RoommateForm.deleteMany({});
    await RoomForm.deleteMany({});
    await Bhojnalaya.deleteMany({});
    await OfficeForm.deleteMany({});
    res.status(200).json({ message: "All listings deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete listings." });
  }
});
router.get("/delete/wishlist", async (req, res) => {
  try {
    await Wishlist.deleteMany({});
    res.status(200).json({ message: "All wishlist deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete listings." });
  }
});

module.exports = router;

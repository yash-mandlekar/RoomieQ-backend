const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const Coupon = require("../models/Coupon");
const User = require("../models/User");

// Route to fetch active coupon for the user
router.get("/user-coupon", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const activeCoupon = await Coupon.findOne({
      user: req.user._id,
      isActive: true,
      expiryDate: { $gt: new Date() },
    });

    if (!activeCoupon) {
      return res.status(200).json({ success: true, coupon: null });
    }

    res.status(200).json({ success: true, coupon: activeCoupon });
  } catch (error) {
    console.error("Error fetching user coupon:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Route to validate and apply a coupon
router.get("/user-coupon/:couponcode",isAuthenticated, async (req, res) => {
  const { couponcode } = req.params;
  try {
    // Find the coupon with the given code
    const coupon = await Coupon.findOne({ code: couponcode });
  
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code." });
    }
  
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: "This coupon is no longer active." });
    }
  
    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: "This coupon has expired." });
    }
  
    // Check if the coupon is restricted to a specific user
    if (coupon.user && coupon.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Coupon is not valid for this user." });
    }
  
    // Return the coupon details
    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
  
});


module.exports = router;

const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const isAuthenticated = require("../middleware/auth");
const { default: axios } = require("axios");
const Coupon = require("../models/Coupon");
router.post("/payment", async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(req.body, "req.body");

    // Razorpay Payment initiation
    const razorpay = new Razorpay({
      key_id: "rzp_test_LQzqvbK2cWMGRg",
      key_secret: "PwCxDvLmPtKVKxZP5BM7eFFx",
    });

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    console.log(order, "order");

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the payment.",
    });
  }
});

router.post("/create-transaction", isAuthenticated, async (req, res) => {
  const { amount, membership, couponCode, paymentId } = req.body;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode,
      user: req.user._id,
      isActive: true,
      expiryDate: { $gte: new Date() },
    });
    console.log(coupon, "coupon");

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired coupon code.",
      });
    }

    coupon.isActive = false; // Deactivate coupon after usage
    await coupon.save();
  }

  if (!amount) {
    return res
      .status(400)
      .json({ success: false, message: "User ID and amount are required." });
  }

  try {
    // Create a new transaction document
    const transaction = new Transaction({
      user: req.user._id,
      amount,
      transactionDate: new Date(), // Default already set, but keeping it for clarity
      paymentId,
    });

    const user = await User.findOne({ _id: req.user._id });
    user.transactions.push(transaction._id);
    user.membership = membership;

    // Correct initialization of currentDate
    const currentDate = new Date();
    const daysToAdd = membership === "Standard" ? 45 : 60;
    const expiryDate = new Date(
      currentDate.setDate(currentDate.getDate() + daysToAdd)
    );

    user.membershipEnd = expiryDate;
    user.membershipExpiry = false;
    user.membershipStart = Date();
    user.isFeatureListing = membership === "Premium";
    user.verified = true;
    await user.save();

    // Save the transaction to the database
    const savedTransaction = await transaction.save();
    const couponValidityDays = membership === "Standard" ? 75 : 90;
    const couponExpiryDate = new Date();
    couponExpiryDate.setDate(couponExpiryDate.getDate() + couponValidityDays);

    const coupon = new Coupon({
      code: `COUPON_${Date.now()}`,
      discountPercentage: 20,
      isActive: true,
      user: req.user._id,
      expiryDate: couponExpiryDate, // Valid for 30 days
    });

    await coupon.save();
    // console.log(coupon,"coupon");

    res.status(201).json({
      success: true,
      data: savedTransaction,
      message: "Coupon issued for 20% discount!",
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.get("/transaction", isAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).populate(
    "transactions"
  );
  res.json(user);
});

router.get("/autosuggest_google", async (req, res) => {
  try {
    const { q } = req.query; // Get the query string from the request
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${q}&types=(cities)&key=${process.env.GOOGLE_API_KEY}`,
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${q}&types=geocode&key=${process.env.GOOGLE_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(data); // Return the response from Google API
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// Refund route

// Backend refund route
router.post("/refund", async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    console.log(req.body, "refund request body");

    const razorpay = new Razorpay({
      key_id: "rzp_test_LQzqvbK2cWMGRg",
      key_secret: "PwCxDvLmPtKVKxZP5BM7eFFx",
    });

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
    });
    console.log(refund, "refund response");
    await Transaction.findOneAndUpdate(
      { paymentId },
      { isRefunded: true },
      { new: true }
    );

    res.status(200).json(refund);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the refund.",
    });
  }
});

module.exports = router;

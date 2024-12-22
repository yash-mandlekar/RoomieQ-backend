const mongoose = require("mongoose");

const Transaction = new mongoose.Schema(
  {
    amount: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionDate: { type: Date, default: Date.now },
    paymentId: String,
    isRefunded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", Transaction);

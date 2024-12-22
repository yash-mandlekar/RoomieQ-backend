const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can refer to Bhojnalaya, RoomForm, etc.
        itemType: { type: String, required: true }, // e.g., 'Bhojnalaya', 'RoomForm'

      },
    ],
  }, { timestamps: true });

module.exports = mongoose.model('WishList', wishlistSchema);

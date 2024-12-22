const User = require("../models/User.js");
const Message = require("../models/message.js");
const cloudinary = require("../lib/cloudinary.js");
const { getReceiverSocketId, io } = require("../lib/socket.js");

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req?.user?._id;
    if (!loggedInUserId) return [];
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!userToChatId || !myId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      deletedFor: { $ne: myId },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUserChats = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; 
    const myId = req.user._id; 

    if (!userToChatId || !myId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await Message.updateMany(
      {
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      },
      { $addToSet: { deletedFor: myId } }
    );

    res.status(200).json({ message: "User chats deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUserChats: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, images } = req.body; // Expecting `images` as an array
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!receiverId || !senderId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        uploadedImages.push(uploadResponse.secure_url);
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: uploadedImages,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markMessagesAsSeen = async (req, res) => {
  try {
    const { id: senderId } = req.params; // The user whose messages the logged-in user is viewing
    const receiverId = req.user._id; // The logged-in user

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Update only the messages sent by `senderId` to `receiverId` that are not seen yet
    await Message.updateMany(
      { senderId, receiverId, seen: false }, // Correcting the filter condition
      { $set: { seen: true } }
    );

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error in markMessagesAsSeen: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  markMessagesAsSeen,
  deleteUserChats,
  sendMessage,
};

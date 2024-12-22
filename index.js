const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/authRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const blogRoutes = require("./Routes/blogRoutes");
const feedbackRoutes = require("./Routes/feedbackRoutes");
const wishlistRoutes = require("./Routes/wishlistRoutes");
const propertyRoutes = require("./Routes/propertyRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const bhojnalayaRoutes = require("./Routes/bhojnalayaRoutes");
const hostelRoutes = require("./Routes/hostelDetailsRoutes");
const officeListingRoutes = require("./Routes/officeListingFormRoutes");
const roommateRoutes = require("./Routes/roommateFormRoutes");
const roomRoutes = require("./Routes/roomRoutes");
const ConsultationRoutes = require("./Routes/ConsultationRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const Message = require("./models/message"); // Import Message model
const searchRoutes = require("./Routes/searchRoutes");
const ExtraRoutes = require("./Routes/ExtraRoutes.js")
const couponRoutes = require("./Routes/couponRoutes.js")
const multer = require("multer");
const { scheduleMembershipReset } = require("./utils/MembershipCron");
const { app, server } = require("./lib/socket.js");


dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:5173","https://new-web-frontend-2.vercel.app"], // The frontend URL
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://reshablath:gnTm9dMnJ75vZZw6@roomieq.ibn4r.mongodb.net/?retryWrites=true&w=majority&appName=roomieq"
  )
  .then(() => {
    console.log("MongoDB connected successfully");
    scheduleMembershipReset();
  })

  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Socket.IO with the HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// const upload = multer({ storage });

// // Routes
// app.post("/api/upload", upload.array("images"), (req, res) => {
//   const filePaths = req.files.map((file) => file.path);
//   res
//     .status(200)
//     .json({ message: "Images uploaded successfully", paths: filePaths });
// });

// app.post("/api/sendMessage", async (req, res) => {
//   try {
//     const { roomId, senderId, receiverId, message, images } = req.body;
//     if (senderId !== req.user.userId) {
//       return res.status(403).json({ error: "Invalid sender" });
//     }
//     const newMessage = new Message(req.body);
//     await newMessage.save();
//     io.to(req.body.roomId).emit("newMessage", newMessage);
//     res.status(200).json(newMessage);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/api/messages/:roomId", async (req, res) => {
//   try {
//     const isAuthorized = await Message.exists({
//       roomId,
//       $or: [{ senderId: req.user.userId }, { receiverId: req.user.userId }],
//     });

//     if (!isAuthorized) {
//       return res.status(403).json({ error: "Access denied" });
//     }
//     const messages = await Message.find({ roomId: req.params.roomId }).sort({
//       timestamp: 1,
//     });
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Socket.io Event Handlers
// io.on("connection", (socket) => {
//   socket.on("joinRoom", async (roomId) => {
//     console.log(`User ${socket.id} joined room ${roomId}`);
//     socket.join(roomId);
//   });

//   socket.on("markSeen", async ({ messageId, roomId }) => {
//     await Message.findByIdAndUpdate(messageId, { isSeen: true });
//     io.to(roomId).emit("messageSeen", messageId);
//   });
// });

// Routes
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", blogRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", ConsultationRoutes);
app.use("/api", notificationRoutes);
app.use("/api", propertyRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", bhojnalayaRoutes);
app.use("/api", hostelRoutes);
app.use("/api", officeListingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", roommateRoutes);
app.use("/api", roomRoutes);
app.use("/api", searchRoutes);
app.use("/api", paymentRoutes);
app.use("/api",ExtraRoutes)
app.use("/api",couponRoutes)

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

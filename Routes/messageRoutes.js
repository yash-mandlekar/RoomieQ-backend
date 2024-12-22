const express = require("express");
const { getMessages, getUsersForSidebar, sendMessage, markMessagesAsSeen, deleteUserChats } = require("../controllers/messageController.js");
const  isAuthenticated  = require('../middleware/auth.js');

const router = express.Router();

router.get("/users",isAuthenticated,getUsersForSidebar);
router.get("/:id",isAuthenticated,getMessages);
router.put("/seen/:id", isAuthenticated, markMessagesAsSeen);
router.post("/send/:id",isAuthenticated,sendMessage);
router.delete("/delete/:id",isAuthenticated,deleteUserChats);

module.exports = router;


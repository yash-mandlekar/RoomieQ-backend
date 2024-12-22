const mongoose = require('mongoose');
const User = require("../models/User");

const toggleImportantUser = async (req, res) => {
    try {
        const u = req.user;
        const { uid } = req.body;
        const user = await User.findById(u._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const uidString = uid.toString();
        const importantUsers = user.importantUserMarked.map((id) => id.toString());

        // Add or remove uid from importantUserMarked
        if (importantUsers.includes(uidString)) {
            user.importantUserMarked = user.importantUserMarked.filter((id) => id.toString() !== uidString);
        } else {
            user.importantUserMarked.push(uid);
        }
        await user.save();
        return res.status(200).json({ message: "User marked as important" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const toggleBlockUser = async (req, res) => {
    try {
        const u = req.user;
        const { uid } = req.body;
        const user = await User.findById(u._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }        
        const uidString = uid.toString();
        const blockedUsers = user.blockedUsers.map((id) => id.toString());
        // Add or remove uid from importantUserMarked
        if (blockedUsers.includes(uidString)) {
            user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== uidString);
        } else {
            user.blockedUsers.push(uid);
        }
        await user.save();
        return res.status(200).json({ message: "User marked as important" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    toggleImportantUser,
    toggleBlockUser
};
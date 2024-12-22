const User = require("../models/User.js");

const checkListingLimit = async (req, res, next) => {
    console.log(req.user, "from checkListingLimit");
    
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (user.membershipExpiry) {
        return res.status(403).json({
          message: "You need to buy a membership to add more listings.",
        });
      }
  
  
      if (user.membership === "Free" && user.listingsCount >= 1) {
        return res.status(403).json({
          message: "You need to buy a membership to add more listings.",
        });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  module.exports = checkListingLimit;
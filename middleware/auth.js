const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log(token,"from auth");
  
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, "tttytygy");
    req.user = await User.findOne({ uid: decoded.uid });

    next();
  } catch (err) {
    res.status(401).json({ error: "Access denied" });
  }
};
module.exports = isAuthenticated;

// In your router file (e.g., authRoutes.js)
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const isAuthenticated = require("../middleware/auth.js");

// Route for signup
router.post("/signup", authController.signup);
router.post("/google-login", authController.googleLogin);
router.get("/logout", authController.logout);

// Route for verifying OTP
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);
router.get("/me", isAuthenticated, authController.getMyProfile);
router.put(
  "/toggleImportant",
  isAuthenticated,
  userController.toggleImportantUser
);
router.put("/toggleBlock", isAuthenticated, userController.toggleBlockUser);

// Route for login
router.post("/login", authController.login);
router.post("/updateName", authController.updateUserName);
router.post("/updateAddress", authController.updateUserAddress);

router.post("/initiate-email-update", authController.initiateEmailUpdate);
router.post("/verify-email-update", authController.verifyAndUpdateEmail);
router.post("/initiate-phone-update", authController.initiatePhoneUpdate);
router.post("/verify-phone-update", authController.verifyAndUpdatePhone);
router.post("/initiate-password-update", authController.initiatePasswordUpdate);
router.post("/verify-password-update", authController.verifyAndUpdatePassword);

// Route for forget password
router.post("/forget-password", authController.forgetPassword); // Add this line
router.post("/verify-forgot-password", authController.verifyForgotPasswordOTP); // Add this line
router.post("/reset-password", authController.resetPassword); // Add this line

router.post(
  "/verify-password-reset-otp",
  authController.verifyPasswordResetOTP
); // Add this line

module.exports = router;

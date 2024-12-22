const nodemailer = require("nodemailer");
const User = require("../models/User");
const OTPModel = require("../models/Otp");
const crypto = require("crypto");

const OTP_EXPIRY_TIME = 300; // 5 minutes
const otps = {}; // In-memory store for OTPs and temporary user data
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/sendToken");
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: "mohitgoku23@gmail.com",
    pass: "fpgczgocfgxtrugb",
  },
});

// Function to send OTP
const sendOTP = (email, otp) => {
  const mailOptions = {
    from: "mohitgoku23@gmail.com",
    to: email,
    subject: "Your OTP Code From RoomieqIndia",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  return transporter.sendMail(mailOptions);
};

// Initial signup request - only sends OTP
const signup = async (req, res) => {
  const { name, email, password, phoneNo } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !name || !phoneNo) {
      return res.status(400).json({
        message: "All fields (name, email, password, phoneNo) are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" }); // Message indicating user already exists
    }

    // Generate OTP and save data (existing code follows)
    const otp = Math.floor(10000 + Math.random() * 90000);
    const otpEntry = new OTPModel({
      email: email.toLowerCase(),
      otp,
      expires: new Date(Date.now() + OTP_EXPIRY_TIME * 1000), // Expiry time
      userData: {
        name,
        password, // Store plaintext password temporarily
        phoneNo,
      },
    });
    await otpEntry.save();

    await sendOTP(email, otp); // Send OTP to user's email
    res.status(200).json({
      message: "OTP sent to your email. Please verify to complete registration",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error during signup",
      error: error.message,
    });
  }
};

//g auth login
const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, send token
      return sendToken(res, user, "User already exists", 200);
    }

    // Create new user
    user = new User({
      name,
      email,
      uid: `UID-${Date.now()}`, // Generate unique UID based on timestamp
    });

    await user.save();

    // Send token for new user
    return sendToken(res, user, "User logged in/created successfully", 201);
  } catch (error) {
    console.error("Error in Google Login Route:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// OTP verification and user creation
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate if email and otp are provided
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // Check if the OTP exists in the database and is valid
    const storedData = await OTPModel.findOne({ email });
    if (!storedData || Date.now() > new Date(storedData.expires)) {
      return res
        .status(400)
        .json({ message: "OTP is invalid or has expired." });
    }

    // Check if the OTP entered by the user matches the one stored in the database
    if (parseInt(otp) !== storedData.otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(storedData.userData.password, 10);
    const user = new User({
      name: storedData.userData.name,
      email,
      password: hashedPassword,
      phoneNo: storedData.userData.phoneNo,
      uid: `UID-${Date.now()}`,
    });

    const savedUser = await user.save();

    // Delete the OTP entry after successful verification
    await OTPModel.deleteOne({ email });

    // Send the success response with a token
    sendToken(res, user, "User registered successfully.", 201);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error during OTP verification." });
  }
};

//get user
const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res) => {
  res
    .status(200)
    .clearCookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

//resend
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if there is an existing OTP for this email
    const existingOtp = await OTPModel.findOne({ email: email.toLowerCase() });

    if (!existingOtp) {
      return res.status(404).json({
        success: false,
        message: "No OTP request found for this email",
      });
    }

    // Generate a new OTP
    const otp = Math.floor(10000 + Math.random() * 90000);

    // Update the OTP and expiration time
    existingOtp.otp = otp;
    existingOtp.expires = new Date(Date.now() + OTP_EXPIRY_TIME * 1000); // New expiry time
    await existingOtp.save();

    // Send the new OTP to the user's email
    await sendOTP(email, otp);

    // Send success response
    res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resending OTP",
      error: error.message,
    });
  }
};

// Login logic
const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        detail: "No account found with this email", // Remove this in production
      });
    }
    console.log(user);

    const ispasswordcorrect = await bcrypt.compare(password, user.password);
    console.log(ispasswordcorrect);

    // Compare plaintext passwords
    if (!ispasswordcorrect) {
      return res.status(400).json({
        message: "Invalid  password",
        detail: "Incorrect password", // Remove this in production
      });
    }

    // Successful login
    console.log("Login successful");

    sendToken(res, user, "Login successful", 200);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};
// Forget password request

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No account found with this email" });
    }

    const otp = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit OTP

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

    await OTPModel.findOneAndUpdate(
      { email },
      { otp, expires: otpExpiry },
      { upsert: true, new: true }
    );

    await sendOTP(email, otp);

    res.status(200).json({
      message: "OTP sent to your email. Please verify to reset your password.",
    });
  } catch (error) {
    console.error("Forget password error:", error);
    res.status(500).json({
      message: "Server error during forget password request",
      error: error.message,
    });
  }
};
const verifyForgotPasswordOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    // Find the OTP record in the database
    const otpRecord = await OTPModel.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > otpRecord.expires) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // OTP is valid, remove it from the database
    await OTPModel.deleteOne({ email });

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying forgot password OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate inputs
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// Verify OTP for password reset
const verifyPasswordResetOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
      });
    }

    // Check if OTP exists and is valid
    const storedData = otps[email];
    if (!storedData || Date.now() > storedData.expires) {
      delete otps[email]; // Clean up expired data
      return res.status(400).json({
        message: "OTP is invalid or has expired",
      });
    }

    // Verify OTP
    if (parseInt(otp) !== storedData.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update user password
    await User.updateOne(
      { email: email.toLowerCase() },
      { password: newPassword }
    );

    // Clean up OTP and temporary data
    delete otps[email];

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "Server error during password reset",
      error: error.message,
    });
  }
};

const updateUserAddress = async (req, res) => {
  const { email, newAddress } = req.body;
  try {
    if (!email || !newAddress) {
      return res.status(400).json({
        message: "Email and new address are required",
      });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { address: newAddress },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      user,
    });
  } catch (error) {
    console.error("Address update error:", error);
    res.status(500).json({
      message: "Server error during address update",
      error: error.message,
    });
  }
};

const updateUserName = async (req, res) => {
  const { email, newName } = req.body;
  try {
    if (!email || !newName) {
      return res.status(400).json({
        message: "Email and new name are required",
      });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name: newName },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Name updated successfully", user });
  } catch (error) {
    console.error("Name update error:", error);
    res.status(500).json({
      message: "Server error during name update",
      error: error.message,
    });
  }
};

// Initial request to update phone number - sends OTP
const initiatePhoneUpdate = async (req, res) => {
  const { email } = req.body; // Destructure newPhoneNo from req.body

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({
        message: "Email are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({
      email: email.toLowerCase(),
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Generate and store OTP
    const otp = Math.floor(10000 + Math.random() * 90000); // 5-digit OTP
    otps[email] = {
      otp,
      expires: Date.now() + OTP_EXPIRY_TIME * 1000, // OTP expiration time in ms// Store newPhoneNo in the updateData
    };

    // Send OTP to email
    await sendOTP(email, otp);

    res.status(200).json({
      message: "OTP sent to your email. Please verify to update phone number.",
      email,
    });
  } catch (error) {
    console.error("Phone update initiation error:", error);
    res.status(500).json({
      message: "Server error during phone update initiation",
      error: error.message,
    });
  }
};

const verifyAndUpdatePhone = async (req, res) => {
  const { email, otp, newPhone } = req.body; // Destructure newPhone from req.body

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Check if OTP exists and is valid
    const storedData = otps[email];
    if (!storedData || Date.now() > storedData.expires) {
      delete otps[email];
      return res.status(400).json({
        message: "OTP is invalid or has expired",
      });
    }

    // Verify OTP
    if (parseInt(otp) !== storedData.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update phone number in the database
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { phoneNo: newPhone }, // Update with newPhone
      { new: true }
    );

    // Clean up OTP data
    delete otps[email];

    res.status(200).json({
      message: "Phone number updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        uid: user.uid,
      },
    });
  } catch (error) {
    console.error("Phone update error:", error);
    res.status(500).json({
      message: "Server error during phone update",
      error: error.message,
    });
  }
};

const initiatePasswordUpdate = async (req, res) => {
  const { email, newPassword } = req.body; // Destructure newPassword from req.body

  try {
    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({
      email: email.toLowerCase(),
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Generate and store OTP
    const otp = Math.floor(10000 + Math.random() * 90000); // 5-digit OTP
    otps[email] = {
      otp,
      expires: Date.now() + OTP_EXPIRY_TIME * 1000,
      newPassword, // Store new password temporarily
    };

    // Send OTP to email
    await sendOTP(email, otp);

    res.status(200).json({
      message: "OTP sent to your email. Please verify to update password.",
      email,
    });
  } catch (error) {
    console.error("Password update initiation error:", error);
    res.status(500).json({
      message: "Server error during password update initiation",
      error: error.message,
    });
  }
};

// Verify OTP and update password
const verifyAndUpdatePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
      });
    }

    // Check if OTP exists and is valid
    const storedData = otps[email];
    if (!storedData || Date.now() > storedData.expires) {
      delete otps[email];
      return res.status(400).json({
        message: "OTP is invalid or has expired",
      });
    }

    // Verify OTP
    if (parseInt(otp) !== storedData.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedPassword }
    );

    // Clean up OTP data
    delete otps[email];

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({
      message: "Server error during password update",
      error: error.message,
    });
  }
};

const initiateEmailUpdate = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({
        message: "Current email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({
      email: email.toLowerCase(),
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate and store OTP
    const otp = Math.floor(10000 + Math.random() * 90000); // 5-digit OTP
    otps[email] = {
      otp,
      expires: Date.now() + OTP_EXPIRY_TIME * 1000,
    };

    // Send OTP to current email
    await sendOTP(email, otp);

    res.status(200).json({
      message: "OTP sent to your current email. Please verify to update email.",
      email,
    });
  } catch (error) {
    console.error("Email update initiation error:", error);
    res.status(500).json({
      message: "Server error during email update initiation",
      error: error.message,
    });
  }
};

// Verify OTP and update email
const verifyAndUpdateEmail = async (req, res) => {
  const { email, otp, newEmail } = req.body;

  try {
    // Validate input
    if (!email || !otp || !newEmail) {
      return res.status(400).json({
        message: "Email, OTP, and new email are required",
      });
    }

    // Check if OTP exists and is valid
    const storedData = otps[email];
    if (!storedData || Date.now() > storedData.expires) {
      delete otps[email];
      return res.status(400).json({
        message: "OTP is invalid or has expired",
      });
    }

    // Verify OTP
    if (parseInt(otp) !== storedData.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if new email is already in use
    const emailExists = await User.findOne({
      email: newEmail.toLowerCase(),
    });
    if (emailExists) {
      return res.status(400).json({
        message: "New email is already in use",
      });
    }

    // Update email
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: newEmail.toLowerCase() },
      { new: true }
    );

    // Clean up OTP data
    delete otps[email];

    res.status(200).json({
      message: "Email updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        uid: user.uid,
      },
    });
  } catch (error) {
    console.error("Email update error:", error);
    res.status(500).json({
      message: "Server error during email update",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  verifyOTP,
  googleLogin,
  resendOTP,
  login,
  logout,
  getMyProfile,
  forgetPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  verifyPasswordResetOTP,
  updateUserAddress,
  initiateEmailUpdate,
  initiatePhoneUpdate,
  initiatePasswordUpdate,
  verifyAndUpdateEmail,
  verifyAndUpdatePhone,
  verifyAndUpdatePassword,
  updateUserName,
};

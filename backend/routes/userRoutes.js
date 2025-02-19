const express = require("express");
const {
  verifyPayment,
  createDonation,
} = require("../controllers/donationController");
const {
  createBooking,
  verifyBookingPayment,
} = require("../controllers/bookingController");
const {
  userLogin,
  userRegister,
  verifyOtp,
  userLogout,
  googleLogin,
  updateUserDetails,
  getCourts,
  getSlots,
  getAddons,
  sendMessage,
  getBookingHistory,
  displayBanner,
  getAllStaffsForUsers,
} = require("../controllers/userController");

const authenticateUser = require("../middlewares/userMiddleware");

const userroute = express.Router();

// Post route
userroute.post("/register", userRegister);
userroute.post("/login", userLogin);
userroute.post("/verify-otp", verifyOtp);
userroute.post("/logout", userLogout);
userroute.post("/donation", createDonation);
userroute.post("/verify-donation", verifyPayment);
userroute.post("/google-login", googleLogin);
userroute.post("/send-message", sendMessage);
userroute.post("/booking", authenticateUser, createBooking);
userroute.post("/verify-booking", authenticateUser, verifyBookingPayment);

// Get route
userroute.get("/get-courts", authenticateUser, getCourts);
userroute.get("/get-slots", authenticateUser, getSlots);
userroute.get("/get-addons", authenticateUser, getAddons);
userroute.get("/user-history", authenticateUser, getBookingHistory);
userroute.get("/banner", displayBanner);
userroute.get("/get-staffs-users", getAllStaffsForUsers);

// Update route
userroute.put("/update-profile", authenticateUser, updateUserDetails);

module.exports = userroute;

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");
const generateUserToken = require("../authentication/generateUserToken");
const Otp = require("../models/otpModel");
const sendOTP = require("../helper/otpHelper");
const Court = require("../models/courtModel");
const Slot = require("../models/slotModel");
const Addons = require("../models/addonModel");
const Booking = require("../models/bookingModel");
const Staff = require("../models/staffModel");
const Enquiry = require("../models/enquiryModel");
const { userUpload } = require("../helper/multer");
const nodemailer = require("nodemailer");
const Bookings = require("../models/bookingModel");
const Banner = require("../models/bannerModel");
const moment = require("moment-timezone");
require("dotenv").config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const client = new OAuth2Client(CLIENT_ID);

const userRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phoneno,
      address,
      profileImage,
    } = req.body;
    console.log(req.body, "req-body");

    if (!name || !email || !password || !confirmPassword || !phoneno) {
      return res.status(400).json({ message: "missing required fields!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExist = await User.findOne({ email }).select("-password");

    if (userExist) {
      return res.status(402).json({ message: "User already exists" });
    }

    const userwithPhone = await User.findOne({ phoneno });

    if (userwithPhone) {
      return res
        .status(200)
        .json({ message: "user with this phoneno exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phoneno,
      password: hashedPassword,
      address,
      profileImage,
      role: "user",
    });

    await user.save();

    await sendOTPVerificationEmail({ id: user._id, email: user.email }, res);

    const token = generateUserToken(res, user._id);

    const userData = await User.findById(user._id).select("-password").lean();

    return res.status(200).json({
      message: "Successfully completed registration",
      user: userData,
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const updateUserDetails = async (req, res) => {
  userUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { email, name, mobile } = req.body;
      const profileImage = req.file ? req.file.filename : null;
      console.log(profileImage, "img");

      console.log("Request Body: ", req.body);
      console.log("Uploaded File: ", req.file);

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { name, phoneno: mobile, profileImage },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User details updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  });
};

const sendOTPVerificationEmail = async ({ id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = id;

    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    const newOtpModel = new Otp({
      _id: userId,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOtpModel.save();

    await sendOTP(email, otp);
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error.message });
      return;
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
      return;
    }
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    console.log(req.body);

    if (!userId || !otp) {
      res.status(400).json({ message: "user ID or OTP is required" });
      return;
    }

    const id = new mongoose.Types.ObjectId(userId);

    const OtpVerifyRecords = await Otp.find({ _id: id });

    if (OtpVerifyRecords.length <= 0) {
      res.status(404).json({
        message: "Account record doesn't exist or has already been verified",
      });
      return;
    }

    const { expiresAt, otp: hashedOtp } = OtpVerifyRecords[0];

    if (expiresAt.getTime() < Date.now()) {
      await Otp.deleteMany({ _id: id });
      res
        .status(400)
        .json({ message: "Code has expired, please request again" });
      return;
    }

    const validOtp = await bcrypt.compare(otp, hashedOtp);

    if (!validOtp) {
      res.status(400).json({
        message: "The provided code is invalid. Please check your inbox",
      });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User record not found" });
      return;
    }

    await User.updateOne({ _id: id }, { $set: { is_verified: true } });

    await Otp.deleteMany({ _id: id });

    res.status(200).json({ user, status: "verified" });

    // res.json({
    //   status: "verified",
    //   name: user.name,
    //   email: user.email,
    //   phoneno: user.phoneno,
    // });
    // return;
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error ? error.message : "An unknown error occurred",
    });
    return;
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(402).json({ message: "User dont exists" });
    }

    if (userExist.is_blocked) {
      res.status(403).json({ message: "Your account is blocked" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, userExist.password);

    if (!passwordMatch) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }

    const token = generateUserToken(res, userExist._id);
    return res.status(200).json({
      user: userExist,
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    res.cookie("adminjwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "logout user" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }

    const client = new OAuth2Client(
      CLIENT_ID,
      CLIENT_SECRET,
      process.env.FRONTEND_URL
    );

    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      return res.status(400).json({ message: "Failed to retrieve ID Token" });
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user.is_blocked) {
      return res.status(401).json({ message: "Your Account is blocked" });
    }

    if (!user) {
      user = new User({
        googleId,
        name,
        email,
      });
      await user.save();
    }

    const generatedToken = generateUserToken(res, user._id);

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generatedToken,
    });
  } catch (error) {
    console.error("Google Login Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCourts = async (req, res) => {
  try {
    const court = await Court.find({});
    console.log(court, "court");
    if (!court) {
      return res.status(400).json({ message: "no courts found" });
    }
    return res.status(200).json({ court });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getSlots = async (req, res) => {
  try {
    const { courtId, date } = req.query;

    if (!courtId || !date) {
      return res.status(400).json({ message: "Court ID and Date are required" });
    }

    // Validate courtId format before conversion
    let id;
    try {
      // Only convert if it appears to be a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(courtId)) {
        id = new mongoose.Types.ObjectId(courtId);
      } else {
        return res.status(400).json({ message: "Invalid Court ID format" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid Court ID format" });
    }

    const startOfDayIST = moment.tz(date, "Asia/Kolkata").startOf("day").set({ hour: 10, minute: 0, second: 0, millisecond: 0 });
    const endOfDayIST = moment.tz(date, "Asia/Kolkata").startOf("day").set({ hour: 22, minute: 0, second: 0, millisecond: 0 });

    const startOfDayUTC = startOfDayIST.clone().utc();
    const endOfDayUTC = endOfDayIST.clone().utc();

    console.log("Start Time (IST):", startOfDayIST.format());
    console.log("End Time (IST):", endOfDayIST.format());
    console.log("Start Time (UTC):", startOfDayUTC.format());
    console.log("End Time (UTC):", endOfDayUTC.format());
    console.log("Court ID:", id);

    const availableSlots = await Slot.find({
      court: id,
      startTime: { $gte: startOfDayUTC.toDate(), $lte: endOfDayUTC.toDate() },
    }).sort({ startTime: 1 });

    console.log(`Found ${availableSlots.length} slots initially`);

    // Create a Map to track unique slots by startTime
    const uniqueSlotsMap = new Map();
    
    // Process each slot, keeping only one slot per unique startTime
    availableSlots.forEach(slot => {
      const startTimeKey = slot.startTime.getTime(); // Use timestamp as unique key
      
      // Only add if this startTime hasn't been seen
      if (!uniqueSlotsMap.has(startTimeKey)) {
        uniqueSlotsMap.set(startTimeKey, slot);
      }
    });
    
    // Convert map values to array
    const uniqueSlots = Array.from(uniqueSlotsMap.values());

    const formattedSlots = uniqueSlots.map(slot => ({
      ...slot.toObject(),
      startTimeIST: moment(slot.startTime).tz("Asia/Kolkata").format("YYYY-MM-DD hh:mm A"),
      endTimeIST: moment(slot.endTime).tz("Asia/Kolkata").format("YYYY-MM-DD hh:mm A"),
    }));
    
    console.log(`Found ${availableSlots.length} slots, reduced to ${formattedSlots.length} unique slots`);
    
    res.json(formattedSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Error fetching slots", error });
  }
};

const getAddons = async (req, res) => {
  try {
    const addons = await Addons.find({ quantity: { $gte: 1 } });

    if (!addons.length) {
      return res.status(404).json({ message: "No add-ons available" });
    }

    return res.status(200).json({ addons });
  } catch (error) {
    console.error("Error fetching add-ons:", error.message);
    res.status(500).json({ message: "Error fetching add-ons", error });
  }
};

const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.USER_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    const newEnquiry = new Enquiry({
      name,
      email,
      message,
    });

    await newEnquiry.save();

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate("user", "name")
      .populate("court", "court_name")
      .populate("slot")
      .sort({ bookingDate: -1 });

    if (!bookings.length) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const displayBanner = async (req, res) => {
  try {
    const banner = await Banner.find({});
    if (!banner) {
      return res.status(404).json({ message: "no banner found!" });
    }

    return res.status(200).json(banner);
  } catch (error) {
    console.log(error.message);
  }
};

const getAllStaffsForUsers = async (req, res) => {
  try {
    const staffs = await Staff.find();

    if (!staffs || staffs.length === 0) {
      return res.status(404).json({ message: "No staff found" });
    }

    return res
      .status(200)
      .json({ message: "Staffs fetched successfully", staffs });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  verifyOtp,
  userLogout,
  googleLogin,
  getCourts,
  getSlots,
  getAddons,
  updateUserDetails,
  sendMessage,
  getBookingHistory,
  displayBanner,
  getAllStaffsForUsers,
};

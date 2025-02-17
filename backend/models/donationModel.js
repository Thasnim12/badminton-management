const mongoose = require("mongoose");

const donationSchema = mongoose.Schema({
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  donor_name: {
    type: String,
    required: true,
  },
  donor_phone: {
    type: String, 
    required: true,
  },
  donor_city: {
    type: String,
    required: true,
  },
  donation_type: {
    type: String,
    enum: ["education", "welfare", "food", "shelters"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  currency: {
    type: String,
    default: "INR",
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  payment_method: {
    type: String,
  },
  client_account: {
    beneficiary_name: String,
    account_number: String,
  },
  transfer_id: {
    type: String,
  },
  transfer_status: {
    type: String,
    enum: ["pending", "processed", "failed"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  completed_at: {
    type: Date,
  },
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;

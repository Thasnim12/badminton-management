const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    name: {
      type: String
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
    slot: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    }],
    addons: [{
      addon: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Addons'
      },
      quantity: {
          type: Number,
          required: true
      },
      type: {
          type: String,
          enum: ['rent', 'buy'],
          required: true
      },
      price: {
          type: Number,
          required: true
      },
      totalPrice: {
          type: Number,
          required: true
      }
    }],
    bookingDate: {
      type: Date,
      required: true,
    },
    bookingType: {  
      type: String,
      enum: ["Online", "Offline"],  
      required: true,
      default: "Online",
    },
    payment: {
      razorpayOrderId: { type: String },  
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      amount: { type: Number, required: true },
      method: { 
        type: String, 
        enum: ["Razorpay", "Cash", "UPI", "Card", "Bank Transfer"], 
        required: true 
      },
      currency: { type: String, default: "INR" },
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Unpaid"], 
        default: "Pending",
      },
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
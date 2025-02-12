const Booking = require('../models/bookingModel')
const Slot = require('../models/slotModel')
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Addons = require('../models/addonModel')


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createBooking = async (req, res) => {
    try {
        const { userId, courtId, slotId, amount,addons } = req.body;

        const slot = await Slot.findById(slotId);
        if (!slot || slot.isBooked) {
            return res.status(400).json({ message: "Slot already booked or unavailable" });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        const newBooking = new Booking({
            user: userId,
            court: courtId,
            slot: slotId,
            bookingDate: new Date(),
            payment: {
                razorpayOrderId: order.id,
                amount,
                status: "Pending",
            },
        });

        await newBooking.save();

        res.status(200).json({
            success: true,
            message: "Booking initiated. Complete payment to confirm.",
            orderId: order.id,
            bookingId: newBooking._id,
        });
    } catch (error) {
        console.error("Error in createBooking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { bookingId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        booking.payment = {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: booking.payment.amount,
            status: "Paid",
        };
        await booking.save();

        await Slot.findByIdAndUpdate(booking.slot, { isBooked: true });

        res.status(200).json({ success: true, message: "Payment verified, booking confirmed!" });
    } catch (error) {
        console.error("Error in verifyPayment:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
};

module.exports = {
    createBooking,
    verifyPayment
}




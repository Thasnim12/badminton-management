const Booking = require('../models/bookingModel')
const Slot = require('../models/slotModel')
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Addons = require('../models/addonModel')
const Rental = require('../models/addonrentalModel')
const { fetchPaymentDetails } = require('../helper/paymentHelper')


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createBooking = async (req, res) => {
    try {
        console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
        console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

        const { courtId, slotId, amount, addons } = req.body;
        const userId = req.user._id;

        if (!Array.isArray(slotId)) {
            return res.status(400).json({ message: "slotId must be an array" });
        }

        const slotPromises = slotId.map(id => Slot.findById(id));
        const slots = await Promise.all(slotPromises);

        const invalidSlot = slots.find((slot, index) => {
            if (!slot || slot.isBooked) {
                return true;
            }
            return false;
        });

        if (invalidSlot) {
            return res.status(400).json({ message: "One or more slots are already booked or unavailable" });
        }


        let totalAmount = amount;
        const validatedAddons = [];

        if (addons && addons.length > 0) {
            for (const addon of addons) {
                const addonItem = await Addons.findById(addon.addonId);
                if (!addonItem) {
                    return res.status(400).json({ message: `Addon ${addon.addonId} not found` });
                }

                if (!addonItem.item_type.includes(addon.type === 'rent' ? 'For Rent' : 'For Sale')) {
                    return res.status(400).json({
                        message: `Addon ${addonItem.item_name} is not available for ${addon.type}`
                    });
                }

                if (addon.type === 'buy' && addonItem.quantity < addon.quantity) {
                    return res.status(400).json({
                        message: `Insufficient quantity for ${addonItem.item_name}`
                    });
                }

                const addonCost = addonItem.price * addon.quantity;
                totalAmount += addonCost;

                validatedAddons.push({
                    addon: addon.addonId,
                    quantity: addon.quantity,
                    type: addon.type,
                    price: addonItem.price,
                    totalPrice: addonCost
                });
            }
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        console.log(order, 'order')

        const newBooking = new Booking({
            user: userId,
            court: courtId,
            slot: slotId,
            bookingDate: new Date(),
            addons: validatedAddons,
            payment: {
                razorpayOrderId: order.id,
                amount: totalAmount,
                status: "Pending",
                method: order.method
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

const verifyBookingPayment = async (req, res) => {
    try {
        const { bookingId, razorpay_payment_id, razorpay_order_id, razorpay_signature, payment_method } = req.body;
        console.log(req.body, 'verify')

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);
        console.log(paymentDetails,'details')

        if (booking.addons && booking.addons.length > 0) {
            for (const addon of booking.addons) {
                if (addon.type === 'buy') {
                    await Addons.findByIdAndUpdate(
                        addon.addon,
                        { $inc: { quantity: -addon.quantity } }
                    );
                } else if (addon.type === 'rent') {
                    const slot = await Slot.findById(booking.slot);
                    const rentalEndTime = new Date(slot.startTime);
                    rentalEndTime.setHours(rentalEndTime.getHours() + 1);

                    const addonRental = new Rental({
                        addon: addon._id,
                        booking: booking._id,
                        quantity: addon.quantity,
                        rentelTime: rentalEndTime,
                    })

                    await addonRental.save();
                }
            }
        }

        booking.payment = {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: booking.payment.amount,
            method: paymentDetails.method,
            status: "Completed",
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
    verifyBookingPayment
}




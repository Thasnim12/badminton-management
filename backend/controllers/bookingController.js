const { Readable } = require("stream");
const fastCsv = require("fast-csv");
const nodemailer = require('nodemailer')
const Booking = require('../models/bookingModel')
const Slot = require('../models/slotModel')
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Addons = require('../models/addonModel')
const Rental = require('../models/addonrentalModel')
const { fetchPaymentDetails } = require('../helper/paymentHelper')
const User = require('../models/userModel')


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});


const createBooking = async (req, res) => {
    try {
        console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
        console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

        const { courtId, slotId, amount, addons } = req.body;
        const { details } = req.body;
        console.log(details, 'details')

        if (!req?.user?._id && !details) {
            return res.status(400).json({
                message: "Guest details required for non-registered users"
            });
        }

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

        console.log(invalidSlot, 'slot')

        if (invalidSlot) {
            return res.status(400).json({ message: "slots are already booked or unavailable" });
        }


        let totalAmount = amount;
        const validatedAddons = [];

        if (addons && addons.length > 0) {
            for (const addon of addons) {
                console.log(addon, "sale")
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

        const bookingData = {
            court: courtId,
            slot: slotId,
            bookingDate: new Date(),
            addons: validatedAddons,
            payment: {
                razorpayOrderId: order.id,
                amount: totalAmount,
                status: "Pending",
            },
        };

        if (req?.user?._id) {
            bookingData.user = req?.user?._id;
        } else {
            bookingData.guestDetails = {
                name: details.name,
                email: details.email,
                phone: details.phone,
                city: details.city,
            };
        }

        const newBooking = new Booking(bookingData);
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

        const booking = await Booking.findById(bookingId).populate("slot").populate("court");
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);
        console.log(paymentDetails, 'details')

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
                        addon: addon.addon,
                        booking: booking._id,
                        quantity: addon.quantity,
                        rentelTime: rentalEndTime,
                        user: booking.user || null,
                        guestDetails: booking.guestDetails || null
                    });

                    await addonRental.save();
                }
            }
        }

        await Slot.updateMany(
            { _id: { $in: booking.slot } },
            { isBooked: true }
        );

        const convertToIST = (utcDate) => {
            return new Date(utcDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        };

        booking.payment = {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: booking.payment.amount,
            method: paymentDetails.method,
            status: "Completed",
        };
        await booking.save();

        const courtName = booking.court ? booking.court.court_name || booking.court.court_name : "N/A";

        const bookingDetails = `
      Booking Confirmation:
      - Name: ${booking.user ? booking.user.name : booking.guestDetails.name}
      - Phone: ${booking.user ? booking.user.phone : booking.guestDetails.phone}
      - Email: ${booking.user ? booking.user.email : booking.guestDetails.email}
      - Court: ${courtName}
      - Date: ${new Date(booking.bookingDate).toLocaleDateString()}
      - Slots: ${booking.slot.map(slot => `${convertToIST(slot.startTime)} - ${convertToIST(slot.endTime)}`).join(', ')}
      - Amount Paid: ${booking.payment.amount}
      - Payment Method: ${booking.payment.method}
    `;

        const userMailOptions = {
            from: process.env.USER_EMAIL,
            to: booking.user ? booking.user.email : booking.guestDetails.email,
            subject: 'Booking Confirmation',
            text: `Dear ${booking.user ? booking.user.name : booking.guestDetails.name},\n\nYour booking has been confirmed.\n\n${bookingDetails}\n\nThank you!`,
        };

        const adminMailOptions = {
            from: process.env.USER_EMAIL,
            to: process.env.USER_EMAIL,
            subject: 'New Booking Confirmed',
            text: `A new booking has been confirmed.\n\n${bookingDetails}`,
        };

        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);


        res.status(200).json({ success: true, message: "Payment verified, booking confirmed!" });
    } catch (error) {
        console.error("Error in verifyPayment:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate("slot", 'startTime endTime')
            .populate("court", 'court_name')
            .populate("user", "name")

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({ message: "No bookings found!" });
        }

        return res.status(200).json({ bookings });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const downloadBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("court", "name")
            .populate("slot", "startTime endTime")
            .populate("addons.addon", "name");

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found" });
        }

        const csvStream = fastCsv.format({ headers: true });

        const readableStream = new Readable({
            read() { },
        });

        res.setHeader("Content-Disposition", "attachment; filename=bookings.csv");
        res.setHeader("Content-Type", "text/csv");

        csvStream.pipe(res);

        bookings.forEach((booking) => {
            csvStream.write({
                "Booking ID": booking._id,
                "User Name": booking.user?.name || "N/A",
                "User Email": booking.user?.email || "N/A",
                "Court Name": booking.court?.court_name || "N/A",
                "Slot Time": booking.slot.map(s => `${s.startTime} - ${s.endTime}`).join(", "),
                "Booking Date": booking.bookingDate.toISOString().split("T")[0],
                "Payment Status": booking.payment.status,
                "Payment Amount": booking.payment.amount,
                "Add-ons": booking.addons.map(a => `${a.addon?.name} (x${a.quantity})`).join(", ") || "None",
                "Total Add-ons Price": booking.addons.reduce((total, a) => total + (a.totalPrice || 0), 0),
                "Cancelled": booking.isCancelled ? "Yes" : "No",
            });
        });

        csvStream.end();
    } catch (error) {
        console.error("Error generating CSV:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const createOfflineBooking = async (req, res) => {
    try {
        const { email, courtId, slotId, amount, transactionId, bookingDate,paymentMethod } = req.body;

        if (!Array.isArray(slotId)) {
            return res.status(400).json({ message: "slotId must be an array" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found in the offline mode!" });
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
            return res.status(400).json({ message: "slots are already booked or unavailable" });
        }


        
        const bookingData = {
            court: courtId,
            slot: slotId,
            bookingDate: new Date(),
            payment: {
                razorpayOrderId: transactionId,
                method:paymentMethod,
                amount: amount,
            },
        };
        
        const newBooking = new Booking(bookingData);
        await newBooking.save();


        await Slot.updateMany(
            { _id: { $in: slotId } },
            { $set: { isBooked: true } }
        );

        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





module.exports = {
    createBooking,
    verifyBookingPayment,
    getBookings,
    downloadBookings,
    createOfflineBooking
}




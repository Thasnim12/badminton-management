const Donation = require('../models/donationModel')
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createDonation = async (req, res) => {
    try {
        const { donor_id, donor_name, amount, currency = "INR" } = req.body;

        if (!amount || amount < 1) {
            return res.status(400).json({ error: "Invalid donation amount" });
        }

        let donorId = null;

        if (donor_id && mongoose.isValidObjectId(donor_id)) {
            donorId = new mongoose.Types.ObjectId(donor_id);
        }

        const options = {
            amount: amount * 100,
            currency,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);

        const donation = new Donation({
            donor_id: donorId,
            donor_name,
            amount,
            currency,
            razorpay_order_id: order.id,
            payment_status: 'pending',
        });

        await donation.save();

        return res.status(200).json({ order, donation })

    }
    catch (error) {
        console.log(error.message)
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log(req.body,'req-body')

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', razorpay.key_secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        const donation = await Donation.findOne({ razorpay_order_id });

        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        donation.razorpay_payment_id = razorpay_payment_id;
        donation.payment_status = 'completed';
        donation.completed_at = new Date();

        await donation.save();

        res.status(200).json({ message: 'Payment verification successful' });

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    createDonation,
    verifyPayment
}
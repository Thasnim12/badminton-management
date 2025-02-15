const Donation = require('../models/donationModel')
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const crypto = require("crypto");
const fastCsv = require("fast-csv");
const { fetchPaymentDetails } = require('../helper/paymentHelper')
const { Readable } = require("stream");


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

        const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);

        const donation = await Donation.findOne({ razorpay_order_id });

        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        donation.razorpay_payment_id = razorpay_payment_id;
        donation.payment_status = 'completed';
        donation.payment_method = paymentDetails.method,
        donation.completed_at = new Date();

        await donation.save();

        res.status(200).json({ message: 'Payment verification successful' });

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const downloadDonations = async(req,res) =>{
        try {
            const donations = await Donation.find().populate("donor_id", "name email");
    
            if (!donations.length) {
                return res.status(404).json({ message: "No donations found" });
            }
    
            const csvStream = fastCsv.format({ headers: true });
    
            const readableStream = new Readable({
                read() {},
            });
    
            res.setHeader("Content-Disposition", "attachment; filename=donations.csv");
            res.setHeader("Content-Type", "text/csv");
    
            csvStream.pipe(res);
    
            donations.forEach((donation) => {
                csvStream.write({
                    "Donation ID": donation._id,
                    "Donor Name": donation.donor_name || "Anonymous",
                    "Donor Email": donation.donor_id?.email || "N/A",
                    "Amount": donation.amount,
                    "Currency": donation.currency,
                    "Payment Status": donation.payment_status,
                    "Payment Method": donation.payment_method || "N/A",
                    "Razorpay Order ID": donation.razorpay_order_id || "N/A",
                    "Razorpay Payment ID": donation.razorpay_payment_id || "N/A",
                    "Created At": donation.created_at.toISOString().split("T")[0],
                    "Completed At": donation.completed_at ? donation.completed_at.toISOString().split("T")[0] : "N/A",
                    "Transfer Status": donation.transfer_status,
                });
            });
    
            csvStream.end();
        } catch (error) {
            console.error("Error generating CSV:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };


module.exports = {
    createDonation,
    verifyPayment,
    downloadDonations
}
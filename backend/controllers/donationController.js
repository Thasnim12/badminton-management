const Donation = require('../models/donationModel')
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createDonation = async(req,res) =>{
    try{
        const { donor_id, donor_name, amount, currency = "INR" } = req.body;

        if (!amount || amount < 1) {
            return res.status(400).json({ error: "Invalid donation amount" });
          }
      
          const options = {
            amount: amount * 100,
            currency, 
            payment_capture: 1,
          };

          const order = await razorpay.orders.create(options);

          const donation = new Donation({
            donor_id,
            donor_name,
            amount,
            currency,
            razorpay_order_id: order.id,
            payment_status: 'pending',
          });
      
          await donation.save();

          return res.status(200).json({order,donation})
      
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = {
    createDonation
}
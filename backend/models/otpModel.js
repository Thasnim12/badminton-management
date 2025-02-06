
const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
   
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp

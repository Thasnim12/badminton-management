const express = require('express')
const { userLogin,userRegister,verifyOtp,userLogout } = require('../controllers/userController')
const { verifyPayment,createDonation } = require('../controllers/donationController')

const userroute = express.Router();

userroute.post('/register',userRegister)
userroute.post('/login',userLogin)
userroute.post('/verify-otp',verifyOtp)
userroute.post('/logout',userLogout)
userroute.post('/donation',createDonation)
userroute.post('/verify-donation',verifyPayment)

module.exports = userroute
const express = require('express')
const { userLogin,userRegister,verifyOtp,userLogout,googleLogin } = require('../controllers/userController')
const { verifyPayment,createDonation } = require('../controllers/donationController')

const userroute = express.Router();

userroute.post('/register',userRegister)
userroute.post('/login',userLogin)
userroute.post('/verify-otp',verifyOtp)
userroute.post('/logout',userLogout)
userroute.post('/donation',createDonation)
userroute.post('/verify-donation',verifyPayment)
userroute.post('/google-login',googleLogin)

module.exports = userroute
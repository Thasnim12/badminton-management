const express = require('express')
const { userLogin,userRegister,verifyOtp,userLogout,googleLogin,updateUserDetails,getCourts,getSlots,getAddons } = require('../controllers/userController')
const { verifyPayment,createDonation } = require('../controllers/donationController')
const { createBooking,verifyBookingPayment } = require('../controllers/bookingController')
const authenticateUser = require('../middlewares/userMiddleware')
const { userUpload } = require('../helper/multer')

const userroute = express.Router();




userroute.post('/register',userRegister)
userroute.post('/login',userLogin)
userroute.post('/verify-otp',verifyOtp)
userroute.post('/logout',userLogout)
userroute.post('/donation',createDonation)
userroute.post('/verify-donation',verifyPayment)
userroute.post('/google-login',googleLogin)

userroute.get('/get-courts',authenticateUser,getCourts)
userroute.get('/get-slots',authenticateUser,getSlots)
userroute.get('/get-addons',authenticateUser,getAddons)
userroute.post('/booking',authenticateUser,createBooking)
userroute.post('/verify-booking',authenticateUser,verifyBookingPayment)




userroute.put('/update-profile', authenticateUser,userUpload,updateUserDetails)

module.exports = userroute
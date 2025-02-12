const express = require('express')
const { userLogin,userRegister,verifyOtp,userLogout,googleLogin,getCourts,getSlots,getAddons } = require('../controllers/userController')
const { userLogin,userRegister,verifyOtp,userLogout,googleLogin, getUserDetails, updateUserDetails } = require('../controllers/userController')
const { verifyPayment,createDonation } = require('../controllers/donationController')
const authenticateUser = require('../middlewares/userMiddleware')

const userroute = express.Router();


userroute.get('/profile', getUserDetails)

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



userroute.put('/update-profile', updateUserDetails)

module.exports = userroute
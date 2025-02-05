const express = require('express')
const { userLogin,userRegister,verifyOtp,userLogout } = require('../controllers/userController')

const userroute = express.Router();

userroute.post('/register',userRegister)
userroute.post('/login',userLogin)
userroute.post('/verify-otp',verifyOtp)
userroute.post('/logout',userLogout)

module.exports = userroute
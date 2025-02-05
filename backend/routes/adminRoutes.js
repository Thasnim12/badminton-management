const express = require('express')
const { adminLogin,adminLogout,getAllusers } = require('../controllers/adminController')
const authenticateAdmin = require('../middlewares/adminMiddleware')

const adminroute = express.Router();

adminroute.get('/users',authenticateAdmin,getAllusers)



adminroute.post('/login',adminLogin)
adminroute.post('/logout',adminLogout)

module.exports = adminroute
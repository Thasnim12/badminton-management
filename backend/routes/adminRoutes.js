const express = require('express')
const { adminLogin,adminLogout,getAllusers,manageUsers } = require('../controllers/adminController')
const authenticateAdmin = require('../middlewares/adminMiddleware')

const adminroute = express.Router();

adminroute.get('/users',authenticateAdmin,getAllusers)



adminroute.post('/login',adminLogin)
adminroute.post('/logout',authenticateAdmin,adminLogout)
adminroute.patch('/users/:userId',authenticateAdmin,manageUsers)

module.exports = adminroute
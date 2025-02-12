const express = require('express')
const { adminLogin,adminLogout,getAllusers,manageUsers,addCourt,getAllcourts,generateSlots,getAllSlots,updateSlot,addStaff,manageAddons,getAlladdons, } = require('../controllers/adminController')
const authenticateAdmin = require('../middlewares/adminMiddleware')


const adminroute = express.Router();

adminroute.get('/users',authenticateAdmin,getAllusers)
adminroute.get('/courts',authenticateAdmin,getAllcourts)
adminroute.get('/slots/:courtId',authenticateAdmin,getAllSlots)
adminroute.get('/addons',authenticateAdmin,getAlladdons)




adminroute.post('/login',adminLogin)
adminroute.post('/logout',authenticateAdmin,adminLogout)
adminroute.post('/courts',authenticateAdmin,addCourt)
adminroute.post('/slots',authenticateAdmin,generateSlots)
adminroute.put('/edit-slots/:slotId',authenticateAdmin,updateSlot)
adminroute.patch('/users/:userId',authenticateAdmin,manageUsers)
adminroute.post('/staffs',authenticateAdmin,addStaff)
adminroute.post('/addons',authenticateAdmin,manageAddons)

module.exports = adminroute
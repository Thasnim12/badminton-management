const express = require('express')
const { adminLogin,adminLogout,getAllusers,manageUsers,addCourt,getAllcourts,generateSlots,getAllSlots,updateSlots } = require('../controllers/adminController')
const authenticateAdmin = require('../middlewares/adminMiddleware')


const adminroute = express.Router();

adminroute.get('/users',authenticateAdmin,getAllusers)
adminroute.get('/courts',authenticateAdmin,getAllcourts)
adminroute.get('/slots',authenticateAdmin,getAllSlots)




adminroute.post('/login',adminLogin)
adminroute.post('/logout',authenticateAdmin,adminLogout)
adminroute.post('/courts',authenticateAdmin,addCourt)
adminroute.post('/slots',authenticateAdmin,generateSlots)
adminroute.put('/edit-slots/:slotId',authenticateAdmin,updateSlots)
adminroute.patch('/users/:userId',authenticateAdmin,manageUsers)

module.exports = adminroute
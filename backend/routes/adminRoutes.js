<<<<<<< HEAD
const express = require('express')
const { adminLogin,adminLogout,getAllusers,manageUsers,addCourt,getAllcourts,generateSlots,getAllSlots,updateSlot,addStaff,manageAddons,getAlladdons, } = require('../controllers/adminController')
const authenticateAdmin = require('../middlewares/adminMiddleware')


const adminroute = express.Router();

adminroute.get('/users',authenticateAdmin,getAllusers)
adminroute.get('/courts',authenticateAdmin,getAllcourts)
adminroute.get('/slots/:courtId',authenticateAdmin,getAllSlots)
adminroute.get('/addons',authenticateAdmin,getAlladdons)
=======
const express = require("express");
const {
  adminLogin,
  adminLogout,
  getAllusers,
  manageUsers,
  addCourt,
  getAllcourts,
  generateSlots,
  getAllSlots,
  updateSlot,
  addStaff,
  getAllStaffs,
  getAllDonations,
  manageStaffs,
  deleteStaff,
  getAdminDetails,
} = require("../controllers/adminController");
const authenticateAdmin = require("../middlewares/adminMiddleware");

const adminroute = express.Router();

adminroute.get("/admin-profile", getAdminDetails);
adminroute.get("/users", authenticateAdmin, getAllusers);
adminroute.get("/courts", authenticateAdmin, getAllcourts);
adminroute.get("/slots/:courtId", authenticateAdmin, getAllSlots);
adminroute.get("/get-staffs", authenticateAdmin, getAllStaffs);
adminroute.get("/get-donations", authenticateAdmin, getAllDonations);

adminroute.post("/login", adminLogin);
adminroute.post("/logout", authenticateAdmin, adminLogout);
adminroute.post("/courts", authenticateAdmin, addCourt);
adminroute.post("/slots", authenticateAdmin, generateSlots);
adminroute.post("/staffs", authenticateAdmin, addStaff);

adminroute.put("/users/:userId", authenticateAdmin, manageUsers);
adminroute.put("/edit-slots/:slotId", authenticateAdmin, updateSlot);
adminroute.put("/staffs/:employee_id", authenticateAdmin, manageStaffs);
>>>>>>> c913e5bc4391fe395793c67b02f4e50091105a6b


adminroute.delete("/staffs/:id", authenticateAdmin, deleteStaff);

<<<<<<< HEAD

adminroute.post('/login',adminLogin)
adminroute.post('/logout',authenticateAdmin,adminLogout)
adminroute.post('/courts',authenticateAdmin,addCourt)
adminroute.post('/slots',authenticateAdmin,generateSlots)
adminroute.put('/edit-slots/:slotId',authenticateAdmin,updateSlot)
adminroute.patch('/users/:userId',authenticateAdmin,manageUsers)
adminroute.post('/staffs',authenticateAdmin,addStaff)
adminroute.post('/addons',authenticateAdmin,manageAddons)

module.exports = adminroute
=======
module.exports = adminroute;
>>>>>>> c913e5bc4391fe395793c67b02f4e50091105a6b

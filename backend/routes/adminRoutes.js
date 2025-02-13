const express = require('express')
const authenticateAdmin = require('../middlewares/adminMiddleware')
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
    manageAddons,
    getAlladdons,
    addBanner,
    getAllBanner,
    viewBanner,
    editBanner
  } = require("../controllers/adminController");

  const { bannerUpload } = require('../helper/multer')
  


const adminroute = express.Router();

adminroute.get('/users',authenticateAdmin,getAllusers)
adminroute.get('/courts',authenticateAdmin,getAllcourts)
adminroute.get('/slots/:courtId',authenticateAdmin,getAllSlots)
adminroute.get('/addons',authenticateAdmin,getAlladdons)
adminroute.get("/admin-profile", getAdminDetails);
adminroute.get("/users", authenticateAdmin, getAllusers);
adminroute.get("/courts", authenticateAdmin, getAllcourts);
adminroute.get("/slots/:courtId", authenticateAdmin, getAllSlots);
adminroute.get("/get-staffs", authenticateAdmin, getAllStaffs);
adminroute.get("/get-donations", authenticateAdmin, getAllDonations);
adminroute.get("/banner", authenticateAdmin, getAllBanner);
adminroute.get('/view-banner/:bannerId',authenticateAdmin,viewBanner)


adminroute.post("/login", adminLogin);
adminroute.post("/logout", authenticateAdmin, adminLogout);
adminroute.post("/courts", authenticateAdmin, addCourt);
adminroute.post("/slots", authenticateAdmin, generateSlots);
adminroute.post("/staffs", authenticateAdmin, addStaff);
adminroute.put("/users/:userId", authenticateAdmin, manageUsers);
adminroute.put("/edit-slots/:slotId", authenticateAdmin, updateSlot);
adminroute.put("/staffs/:employee_id", authenticateAdmin, manageStaffs);
adminroute.delete("/staffs/:id", authenticateAdmin, deleteStaff);
adminroute.post('/addons',authenticateAdmin,manageAddons)
adminroute.post('/banner',authenticateAdmin,addBanner)
adminroute.put('/banner/:bannerId',authenticateAdmin,bannerUpload,editBanner)


module.exports = adminroute;

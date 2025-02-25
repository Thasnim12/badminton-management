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
  editBanner,
  getMessages,
  addUser,
  deleteCourt,
  deleteBanner,
  editStatus,
  deleteAddons,
  editAddons,
  getAllslots,

} = require("../controllers/adminController");

const { getBookings,
  createOfflineBooking,
  downloadBookings
} = require('../controllers/bookingController')
const { downloadDonations } = require('../controllers/donationController')

const { bannerUpload, courtUpload, staffUpload } = require('../helper/multer');



const adminroute = express.Router();

//Get route
adminroute.get('/users', authenticateAdmin, getAllusers)
adminroute.get('/courts', getAllcourts)
adminroute.get('/slots/:courtId', getAllSlots)
adminroute.get('/addons', authenticateAdmin, getAlladdons)
adminroute.get("/admin-profile", authenticateAdmin, getAdminDetails);
adminroute.get("/users", authenticateAdmin, getAllusers);
adminroute.get("/courts", getAllcourts);
adminroute.get("/slots/:courtId", authenticateAdmin, getAllSlots);
adminroute.get("/get-staffs", authenticateAdmin, getAllStaffs);
adminroute.get("/get-donations", authenticateAdmin, getAllDonations);
adminroute.get("/banner", authenticateAdmin, getAllBanner);
adminroute.get('/view-banner/:bannerId', authenticateAdmin, viewBanner)
adminroute.get("/get-message", authenticateAdmin, getMessages);
adminroute.get('/bookings', authenticateAdmin, getBookings)
adminroute.get('/download-donation', authenticateAdmin, downloadDonations)
adminroute.get('/download-booking', authenticateAdmin, downloadBookings)
adminroute.get('/get-slots', getAllslots)


//Post route
adminroute.post("/login", adminLogin);
adminroute.post("/logout", authenticateAdmin, adminLogout);
adminroute.post("/courts", addCourt);
adminroute.post("/slots", generateSlots);
adminroute.post("/staffs", authenticateAdmin, addStaff);
adminroute.post('/addons', authenticateAdmin, manageAddons)
adminroute.post('/banner', authenticateAdmin, addBanner)
adminroute.post('/add-user', authenticateAdmin, addUser)
adminroute.post('/offline-bookings', authenticateAdmin, createOfflineBooking)

//Edit route
adminroute.put("/users/:userId", authenticateAdmin, manageUsers);
adminroute.put("/edit-slots/:slotId", authenticateAdmin, updateSlot);
adminroute.put("/staffs/:employee_id", authenticateAdmin, manageStaffs);
adminroute.put('/edit-addons/:addonsId', authenticateAdmin, editAddons)
adminroute.put('/banner/:bannerId', authenticateAdmin, bannerUpload, editBanner)
adminroute.put('/status', authenticateAdmin, editStatus)

// Delete route
adminroute.delete("/staffs/:id", authenticateAdmin, deleteStaff);
adminroute.delete('/delete-court', deleteCourt)
adminroute.delete('/delete-banner/:bannerId', authenticateAdmin, deleteBanner)
adminroute.delete('/delete-addons/:addonsId', authenticateAdmin, deleteAddons)

module.exports = adminroute;

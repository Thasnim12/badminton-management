import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./User/Home";
import Donate from "./User/Pages/Donate";
import Contact from "./User/Pages/Contact";
import Login from "./User/Auth/Login";
import Bookings from "./User/Pages/Bookings";
import Register from "./User/Auth/Register";
import AboutUs from "./User/Pages/About";
import BookingPage from "./User/Pages/BookNow";
import BookingSummary from "./User/Pages/Confirmbooking";
import Addons from "./Admin/Pages/Addons";

import Dashboard from "./Admin/Pages/Dashboard";
import Users from "./Admin/Pages/Users";
import ManageDonations from "./Admin/Pages/ManageDonations";
import ManageBookings from "./Admin/Pages/ManageBookings";
import ManagePayments from "./Admin/Pages/ManagePayments";
// import ManageReports from './Admin/Pages/ManageReports';
import ManageCourts from "./Admin/Pages/ManageCourts";
import AdminLogin from "./Admin/Auth/AdminLogin";
import Settings from "./Admin/Pages/Settings";
import ProtectedAdmin from "./Admin/Global/ProtectedAdmin";
import ProtectedRoute from "./User/Global/ProtectedRoutes";




const AppRoutes = () => {
  // const user = useSelector((state) => state.user); // Replace with your actual state management logic

  // const isAdmin = user && user.role === "admin"; // Check if the user is logged in and is an admin

  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-now" element={<BookingPage />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/confirm-bookings" element={<BookingSummary />} />


        <Route
          path="/admin"
          element={<ProtectedAdmin element={<Dashboard />} />}
        />
        <Route
          path="/admin/users"
          element={<ProtectedAdmin element={<Users />} />}
        />
        <Route path="/admin/manage-donations"  element={<ProtectedAdmin element={<ManageDonations />} />}/>
        <Route path="/admin/manage-bookings" element={<ProtectedAdmin element={<ManageBookings />} />} />
        <Route path="/admin/manage-payments"  element={<ProtectedAdmin element={<ManagePayments />} />}/>
        <Route path="/admin/manage-courts"  element={<ProtectedAdmin element={<ManageCourts />} />}/>
        <Route path="/admin/settings"  element={<ProtectedAdmin element={<Settings />} />} />
        <Route path="/admin/manage-addons"  element={<ProtectedAdmin element={<Addons />} />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

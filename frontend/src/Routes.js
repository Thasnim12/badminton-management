import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./User/Home";
import Donate from "./User/Pages/Donate";
import Contact from "./User/Pages/Contact"
import Login from "./User/Auth/Login";
import Bookings from "./User/Pages/Bookings"
import Register from "./User/Auth/Register";
import AboutUs from "./User/Pages/About";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element= {<Donate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

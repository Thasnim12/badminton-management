import React, { useState } from "react";
import {
  Card,
  Button,
  MenuItem,
  Select,
  TextField,
  Grid,
  Typography,
  Box,
  CardMedia,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import Header from "../Global/Header";
import Footer from "../Global/Footer";

const CourtBooking = () => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const handleOpenPaymentModal = () => setOpenPaymentModal(true);
  const handleClosePaymentModal = () => setOpenPaymentModal(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState("Court 1");
  const [availableSlots, setAvailableSlots] = useState(generateSlots());
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(60);
  const [cartItems, setCartItems] = useState({
    sale: [],
    rent: [],
  });
  const [bookings, setBookings] = useState([]); // To store multiple bookings

  // Court image URLs
  const courtImages = {
    "Court 1":
      "https://www.shutterstock.com/image-photo/badminton-court-without-people-night-600nw-2307374507.jpg",
    "Court 2":
      "https://content.jdmagicbox.com/comp/def_content/badminton-courts/6-badminton-courts-4-6f9mp.jpg",
  };

  function generateSlots() {
    return Array.from({ length: 16 }, (_, i) => ({
      time: dayjs()
        .hour(6 + i)
        .minute(0)
        .format("h:mm A"),
      available: Math.random() > 0.3, // Random availability
    }));
  }

  const [selectedAddOns, setSelectedAddOns] = useState({
    shuttlecocks: 0,
    racquetSale: 0,
    racquetRent: 0,
  });

  const handleAddOnSelection = (addOn, price) => {
    setSelectedAddOns((prevAddOns) => {
      const newAddOns = { ...prevAddOns };
      if (addOn === "shuttlecocks") {
        newAddOns.shuttlecocks = newAddOns.shuttlecocks > 0 ? 0 : 1; // Toggle shuttlecocks quantity
      } else if (addOn === "racquetSale") {
        newAddOns.racquetSale = newAddOns.racquetSale > 0 ? 0 : 1; // Toggle racquet sale
      } else if (addOn === "racquetRent") {
        newAddOns.racquetRent = newAddOns.racquetRent > 0 ? 0 : 1; // Toggle racquet rent
      }
      return newAddOns;
    });
  };

  const calculateTotalPrice = () => {
    const addOnTotal =
      selectedAddOns.shuttlecocks * 200 +
      selectedAddOns.racquetSale * 500 +
      selectedAddOns.racquetRent * 100;

    return bookings.reduce((acc, b) => acc + b.totalPrice, 0) + addOnTotal;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setAvailableSlots(generateSlots()); // Simulate slot availability change
  };

  const handleAddToCart = (item, type) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      updatedCart[type].push(item);
      return updatedCart;
    });
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot.");
      return;
    }
    const price = (duration / 60) * 300; // Base price for court booking
    const rentPrice = cartItems.rent.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const salePrice = cartItems.sale.reduce(
      (total, item) => total + item.price,
      0
    );
    const totalPrice = price + rentPrice + salePrice;

    // Store booking in the bookings state
    setBookings((prevBookings) => [
      ...prevBookings,
      {
        selectedCourt,
        selectedDate,
        selectedTime,
        duration,
        totalPrice,
        cartItems,
      },
    ]);
    // Reset the form after booking
    setSelectedTime(null);
    setDuration(30);
    setCartItems({
      sale: [],
      rent: [],
    });
  };

  const handleBookingRemoval = (index) => {
    setBookings(bookings.filter((_, i) => i !== index));
  };

  const Section = styled(Box)(({ theme }) => ({
    textAlign: "center",
    backgroundColor: theme.palette.background.default,
  }));

  return (
    <>
      <Header />
      <Section>
        <Grid container spacing={3} padding={3}>
          {/* Court Booking Section */}
          <Grid item xs={10} md={4}>
            <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Court Availability
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField fullWidth {...params} margin="normal" />
                  )}
                />
              </LocalizationProvider>

              {/* Court Selection */}
              <Select
                fullWidth
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                sx={{ marginTop: 2, borderRadius: 2 }}
              >
                <MenuItem value="Court 1">Court 1</MenuItem>
                <MenuItem value="Court 2">Court 2</MenuItem>
              </Select>

              {/* Court Image */}
              <Box sx={{ marginTop: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={courtImages[selectedCourt]}
                  alt={selectedCourt}
                  sx={{ borderRadius: 2 }}
                />
              </Box>

              {/* Slot Selection */}
              <Grid container spacing={1} mt={2}>
                {availableSlots.map((slot) => (
                  <Grid item xs={3} key={slot.time}>
                    <Button
                      fullWidth
                      variant={
                        selectedTime === slot.time ? "contained" : "outlined"
                      }
                      color={slot.available ? "success" : "error"}
                      disabled={!slot.available}
                      sx={{
                        backgroundColor: !slot.available
                          ? "rgba(255, 0, 0, 0.1)"
                          : "",
                        "&.Mui-disabled": {
                          backgroundColor: "rgba(255, 0, 0, 0.1)",
                          color: "rgba(255, 0, 0, 0.7)",
                        },
                      }}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Booking Confirmation */}
            <Card
              sx={{ padding: 3, marginTop: 3, borderRadius: 3, boxShadow: 2 }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Confirm Court Booking
              </Typography>
              <Select
                fullWidth
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                sx={{ marginBottom: 2, borderRadius: 2 }}
              >
                <MenuItem value="Court 1">Court 1</MenuItem>
                <MenuItem value="Court 2">Court 2</MenuItem>
              </Select>
              <Select
                fullWidth
                value={selectedTime || ""}
                onChange={(e) => setSelectedTime(e.target.value)}
                sx={{ marginBottom: 2, borderRadius: 2 }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Time Slot
                </MenuItem>
                {availableSlots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <MenuItem key={slot.time} value={slot.time}>
                      {slot.time}
                    </MenuItem>
                  ))}
              </Select>
              <Select
                fullWidth
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                sx={{ marginBottom: 2, borderRadius: 2 }}
              >
                {[60, 90, 120].map((min) => (
                  <MenuItem key={min} value={min}>
                    {min} Minutes
                  </MenuItem>
                ))}
              </Select>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ marginTop: 3 }}
                onClick={handleBooking}
              >
                Book Now
              </Button>
            </Card>
          </Grid>

          <Grid item xs={10} md={3}>
            {/* Add-On Section */}

            <Card
              sx={{ padding: 3, marginTop: 3, borderRadius: 3, boxShadow: 2 }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Add-Ons
              </Typography>

              {/* Add-Ons List */}
              <Grid container spacing={2}>
                {/* Shuttlecocks */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant={
                      selectedAddOns.shuttlecocks ? "contained" : "outlined"
                    }
                    color="primary"
                    onClick={() => handleAddOnSelection("shuttlecocks", 200)}
                    sx={{ justifyContent: "space-between", display: "flex" }}
                  >
                    <Typography>Shuttlecocks (₹200)</Typography>
                    {selectedAddOns.shuttlecocks ? "✔" : "+"}
                  </Button>
                </Grid>

                {/* Racquet Sale */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant={
                      selectedAddOns.racquetSale ? "contained" : "outlined"
                    }
                    color="secondary"
                    onClick={() => handleAddOnSelection("racquetSale", 500)}
                    sx={{ justifyContent: "space-between", display: "flex" }}
                  >
                    <Typography>Racquet (Buy ₹500)</Typography>
                    {selectedAddOns.racquetSale ? "✔" : "+"}
                  </Button>
                </Grid>

                {/* Racquet Rent */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant={
                      selectedAddOns.racquetRent ? "contained" : "outlined"
                    }
                    color="success"
                    onClick={() => handleAddOnSelection("racquetRent", 100)}
                    sx={{ justifyContent: "space-between", display: "flex" }}
                  >
                    <Typography>Racquet (Rent ₹100)</Typography>
                    {selectedAddOns.racquetRent ? "✔" : "+"}
                  </Button>
                </Grid>
              </Grid>

              {/* Total Price */}
              <Typography
                variant="h6"
                sx={{ marginTop: 2, fontWeight: "bold" }}
              >
                Total Add-On Price: ₹
                {selectedAddOns.shuttlecocks * 200 +
                  selectedAddOns.racquetSale * 500 +
                  selectedAddOns.racquetRent * 100}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={10} md={3}>
            {/* Scrollable Booking Summary Section */}
            <Box
              sx={{
                width: "100%",
                marginTop: 3,
                borderRadius: 2,
                border: "1px solid #ddd",
                padding: 2,
                backgroundColor: "#f9f9f9",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Booking Summary
              </Typography>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <Card key={index} sx={{ marginBottom: 2, padding: 2 }}>
                    <Typography variant="body1">
                      Court: {booking.selectedCourt}
                    </Typography>
                    <Typography variant="body1">
                      Date: {dayjs(booking.selectedDate).format("MMMM D, YYYY")}
                    </Typography>
                    <Typography variant="body1">
                      Time: {booking.selectedTime}
                    </Typography>
                    <Typography variant="body1">
                      Duration: {booking.duration} minutes
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Total: ₹{booking.totalPrice}
                    </Typography>
                    <Button
                      color="error"
                      onClick={() => handleBookingRemoval(index)}
                      sx={{ marginTop: 2 }}
                    >
                      Remove
                    </Button>
                  </Card>
                ))
              ) : (
                <Typography>No bookings made yet.</Typography>
              )}

              {/* Updated Total Price with Add-ons */}
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", marginTop: 2 }}
              >
                Updated Total (including Add-Ons): ₹{calculateTotalPrice()}
              </Typography>

              {/* Confirm & Pay Button */}
              {bookings.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={handleOpenPaymentModal}
                >
                  Confirm & Pay
                </Button>
              )}
            </Box>

            {/* Payment Modal */}
            <Modal
              open={openPaymentModal}
              onClose={handleClosePaymentModal}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openPaymentModal}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Payment Details
                  </Typography>
                  <Typography variant="body1">
                    Total Amount: ₹{calculateTotalPrice()}
                  </Typography>

                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ marginTop: 3 }}
                    onClick={() => alert("Proceeding to Payment Gateway...")}
                  >
                    Proceed to Pay
                  </Button>
                </Box>
              </Fade>
            </Modal>
          </Grid>
        </Grid>
      </Section>

      <Footer />
    </>
  );
};

export default CourtBooking;

import React, { useState } from "react";
import {
  Card,
  Button,
  MenuItem,
  Select,
  Grid,
  Typography,
  Box,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { skipToken } from "@reduxjs/toolkit/query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import { useGetAllcourtsQuery, useGetSlotsQuery, useGetAddonsQuery } from "../../Slices/UserApi";
import AddOnsDrawer from "../Components/Drawer";
import DetailsCard from "../Components/DetailsCard";


const CourtBooking = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);


  console.log(selectedCourt, 'court')


  const { data, isLoading: courtsLoading } = useGetAllcourtsQuery();
  const courts = data?.court || [];

  const { data: slotsData, error, isLoading } = useGetSlotsQuery({
    courtId: selectedCourt,
    date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null
  });

  const { data: addons, isLoading: addonLoading } = useGetAddonsQuery();
  console.log(addons, 'ad')

  const slots = slotsData || [];
  console.log(slots, 'slots')





  const courtImages = {
    "Court 1": "https://www.shutterstock.com/image-photo/badminton-court-without-people-night-600nw-2307374507.jpg",
    "Court 2": "https://content.jdmagicbox.com/comp/def_content/badminton-courts/6-badminton-courts-4-6f9mp.jpg",
  };



  const handleAddOnToggle = (addOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((item) => item._id === addOn._id);
      return exists ? prev.filter((item) => item._id !== addOn._id) : [...prev, addOn];
    });
  };

  const handleCourtChange = (e) => {
    setSelectedCourt(e.target.value);
    setOpenDrawer(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot.");
      return;
    }
    const addOnTotal = Object.values(selectedAddOns).reduce((acc, val) => acc + val, 0);
    setBookingSummary({ selectedCourt, selectedDate, selectedTime, total: 300 + addOnTotal });
    setOpenDialog(true);

  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Grid container spacing={2} sx={{ maxWidth: "80%",marginLeft:"10px",padding:'5px' }}>

          <Grid item xs={12} md={4} sx={{ height: "100vh" }}>
              <DetailsCard />
          </Grid>

          <Grid item xs={12} md={8} container spacing={2}>

            <Grid item xs={12}>
              <Card sx={{ padding: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                <Typography variant="h6" fontWeight="bold">Select Court & Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker value={selectedDate} onChange={setSelectedDate} />
                </LocalizationProvider>
                <Select fullWidth value={selectedCourt} onChange={handleCourtChange} sx={{ mt: 2 }}>
                  {courtsLoading ? <MenuItem disabled>Loading courts...</MenuItem> :
                    courts?.map((court) => (
                      <MenuItem key={court._id} value={court._id}>{court.court_name}</MenuItem>
                    ))
                  }
                </Select>
                <CardMedia component="img" height="150" image={courtImages[selectedCourt]} sx={{ marginTop: 2 }} />
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ padding: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                <Typography variant="h6" fontWeight="bold">Select Time Slot</Typography>
                <Box sx={{ overflowY: "auto", maxHeight: 300, mt: 2 }}>
                  <Grid container spacing={1}>
                    {isLoading ? (
                      <Typography>Loading slots...</Typography>
                    ) : slots?.length === 0 ? (
                      <Typography>No slots available.</Typography>
                    ) : (
                      slots.map((slot) => (
                        <Grid item xs={4} key={slot._id}>
                          <Button
                            fullWidth
                            variant={selectedTime === slot.startTime ? "contained" : "outlined"}
                            color={slot.isBooked ? "error" : "primary"}
                            disabled={slot.isBooked}
                            onClick={() => setSelectedTime(slot.startTime)}
                          >
                            {dayjs(slot.startTime).format("h:mm A")}
                          </Button>
                        </Grid>
                      ))
                    )}
                  </Grid>
<<<<<<< HEAD
=======
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
>>>>>>> c913e5bc4391fe395793c67b02f4e50091105a6b
                </Box>
              </Card>
            </Grid>

          </Grid>

        </Grid>


        <Footer />
      </Box>
      <AddOnsDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        addons={addons}
        selectedAddOns={selectedAddOns}
        onToggle={handleAddOnToggle}
        loading={addonLoading}
      />

      <Dialog open={openHistoryModal} onClose={() => setOpenHistoryModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking History</DialogTitle>
        <DialogContent>
          {bookingSummary ? (
            <Box>
              <CardMedia
                component="img"
                height="200"
                image={courtImages[bookingSummary.selectedCourt]}
                sx={{ borderRadius: 2 }}
              />
              <Typography variant="h6" mt={2}>Court: {bookingSummary.selectedCourt}</Typography>
              <Typography>Date: {dayjs(bookingSummary.selectedDate).format("DD-MM-YYYY")}</Typography>
              <Typography>Time Slot: {bookingSummary.selectedTime}</Typography>
              <Typography variant="h6" mt={2}>Add-Ons:</Typography>
              {Object.entries(selectedAddOns).map(([name, price]) => (
                price > 0 && <Typography key={name}>{name} - ₹{price}</Typography>
              ))}
              <Typography variant="h6" mt={2}>Total Price: ₹{bookingSummary.total}</Typography>
            </Box>
          ) : (
            <Typography>No previous bookings.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistoryModal(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default CourtBooking;

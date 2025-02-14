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
import {
  useGetAllcourtsQuery,
  useGetSlotsQuery,
  useGetAddonsQuery,
} from "../../Slices/UserApi";
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

  console.log(selectedCourt, "court");

  const { data, isLoading: courtsLoading } = useGetAllcourtsQuery();
  const courts = data?.court || [];

  const {
    data: slotsData,
    error,
    isLoading,
  } = useGetSlotsQuery({
    courtId: selectedCourt,
    date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
  });

  const { data: addons, isLoading: addonLoading } = useGetAddonsQuery();
  console.log(addons, "ad");

  const slots = slotsData || [];
  console.log(slots, "slots");

  const courtImages = {
    "Court 1":
      "https://www.shutterstock.com/image-photo/badminton-court-without-people-night-600nw-2307374507.jpg",
    "Court 2":
      "https://content.jdmagicbox.com/comp/def_content/badminton-courts/6-badminton-courts-4-6f9mp.jpg",
  };

  const handleAddOnToggle = (addOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((item) => item._id === addOn._id);
      return exists
        ? prev.filter((item) => item._id !== addOn._id)
        : [...prev, addOn];
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
    const addOnTotal = Object.values(selectedAddOns).reduce(
      (acc, val) => acc + val,
      0
    );
    setBookingSummary({
      selectedCourt,
      selectedDate,
      selectedTime,
      total: 300 + addOnTotal,
    });
    setOpenDialog(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#dedede",
          alignItems: "center",
        }}
      >
        <Header />
        <Grid
          container
          spacing={2}
          sx={{ maxWidth: "80%", marginLeft: "10px", padding: "5px" }}
        >
          <Grid item xs={12} md={4} sx={{ height: "100vh", marginTop: "3px" }}>
            <DetailsCard />
          </Grid>

          <Grid
            item
            xs={12}
            md={8}
            container
            spacing={2}
            sx={{ marginTop: "3px", height: "90vh" }}
          >
            <Grid item xs={12}>
              <Card
                sx={{
                  padding: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Select Court & Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker value={selectedDate} onChange={setSelectedDate} />
                </LocalizationProvider>
                <Select
                  fullWidth
                  value={selectedCourt}
                  onChange={handleCourtChange}
                  sx={{ mt: 2 }}
                >
                  {courtsLoading ? (
                    <MenuItem disabled>Loading courts...</MenuItem>
                  ) : (
                    courts?.map((court) => (
                      <MenuItem key={court._id} value={court._id}>
                        {court.court_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                <CardMedia
                  component="img"
                  height="150"
                  image={courtImages[selectedCourt]}
                  sx={{ marginTop: 2 }}
                />
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  padding: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Select Time Slot
                </Typography>
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
                            variant={
                              selectedTime === slot.startTime
                                ? "contained"
                                : "outlined"
                            }
                            color={slot.isBooked ? "error" : "primary"}
                            disabled={slot.isBooked}
                            onClick={() => setSelectedTime(slot.startTime)}
                          >
                            {`${dayjs(slot.startTime).format("h:mm A")} - ${dayjs(slot.endTime).format("h:mm A")}`}
                          </Button>
                        </Grid>
                      ))
                    )}
                  </Grid>
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

      <Dialog
        open={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        maxWidth="md"
        fullWidth
      >
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
              <Typography variant="h6" mt={2}>
                Court: {bookingSummary.selectedCourt}
              </Typography>
              <Typography>
                Date: {dayjs(bookingSummary.selectedDate).format("DD-MM-YYYY")}
              </Typography>
              <Typography>Time Slot: {bookingSummary.selectedTime}</Typography>
              <Typography variant="h6" mt={2}>
                Add-Ons:
              </Typography>
              {Object.entries(selectedAddOns).map(
                ([name, price]) =>
                  price > 0 && (
                    <Typography key={name}>
                      {name} - ₹{price}
                    </Typography>
                  )
              )}
              <Typography variant="h6" mt={2}>
                Total Price: ₹{bookingSummary.total}
              </Typography>
            </Box>
          ) : (
            <Typography>No previous bookings.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistoryModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourtBooking;

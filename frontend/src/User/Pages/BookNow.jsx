import React, { useState, useEffect } from "react";
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
  TextField,
  Divider,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { skipToken } from "@reduxjs/toolkit/query";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CalendarToday } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import {
  useGetAllcourtsQuery,
  useGetSlotsQuery,
  useGetAddonsQuery,
  useCreateBookingMutation,
  useVerifyBookingMutation,
} from "../../Slices/UserApi";
import AddOnsDrawer from "../Components/Drawer";
import DetailsCard from "../Components/DetailsCard";
import moment from "moment";
import momentTime from "moment-timezone";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CourtBooking = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [openCalendar, setOpenCalendar] = useState(false); // Control the DatePicker
  const [selectedCourt, setSelectedCourt] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Kolkata"));


  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const validateUserDetails = () => {
    return (
      userDetails.name &&
      userDetails.email &&
      userDetails.phone &&
      userDetails.city
    );
  };

  const handleConfirmPay = () => {
    if (validateUserDetails()) {
      handleBooking(); // Proceed with booking
    } else {
      setOpenUserDialog(true); // Show dialog if details are missing
    }
  };

  const handleSubmitDetails = () => {
    if (validateUserDetails()) {
      setOpenUserDialog(false);
      handleBooking(); // Proceed to booking after details are filled
    } else {
      setAlert("Please fill all the required fields.");
      setAlertSeverity("error");
      setOpenSnackbar(true); // Open the snackbar
    }
  };

  const [bookingData, setBookingData] = useState({
    courtId: "",
    slotId: [],
    amount: 0,
    addons: [],
    courtImage: "",
  });

  const [createBooking] = useCreateBookingMutation();
  const [verifyBooking] = useVerifyBookingMutation();
  const [bookingHistory, setBookingHistory] = useState(null);
  const [processing, setProcessing] = useState(false);

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

  const calculateTotalAmount = (includeGst = true) => {
    let total = 0;

    selectedSlots.forEach((slot) => {
      total += slot.price;
    });

    selectedAddOns.forEach((addOn) => {
      total += addOn.quantity * addOn.price;
    });

    if (includeGst) {
      const gst = (total * 18) / 100; // Correct GST Calculation
      return total + gst;
    }

    return total;
  };

  console.log(bookingData, "book-data");

  useEffect(() => {
    setBookingData((prev) => ({
      ...prev,
      courtId: selectedCourt,
      date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
      slotId: selectedSlots.map((slot) => slot._id),
      addons: selectedAddOns.map((addon) => addon._id),
      amount: calculateTotalAmount(),
    }));
  }, [selectedCourt, selectedDate, selectedSlots, selectedAddOns]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().tz("Asia/Kolkata"));
    }, 60000); // Update every minute

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const courtImages = {
    "Court 1":
      "https://www.shutterstock.com/image-photo/badminton-court-without-people-night-600nw-2307374507.jpg",
    "Court 2":
      "https://content.jdmagicbox.com/comp/def_content/badminton-courts/6-badminton-courts-4-6f9mp.jpg",
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ Razorpay script loaded");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Razorpay script failed to load");
        reject(new Error("Failed to load Razorpay SDK"));
      };
      document.body.appendChild(script);
    });
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const handleBooking = async () => {
    try {
      setProcessing(true);

      if (!selectedCourt || !selectedDate || selectedSlots.length === 0) {
        alert("Please select court, date and at least one time slot");
        return;
      }

      console.log("Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);
      console.log(selectedAddOns, " select");
      const formattedAddons = selectedAddOns.map((addon) => ({
        addonId: addon._id,
        quantity: 1,
        type: addon.item_type.includes("For Sale")
          ? "buy"
          : addon.item_type.includes("For Rent")
            ? "rent"
            : "unknown",
      }));

      if (typeof window.Razorpay === "undefined") {
        console.log("Razorpay not loaded, attempting to load...");
        await loadRazorpayScript();
        if (typeof window.Razorpay === "undefined") {
          throw new Error("Failed to load Razorpay");
        }
      }

      const bookingResponse = await createBooking({
        courtId: selectedCourt,
        slotId: selectedSlots.map((slot) => slot._id),
        amount: calculateTotalAmount(),
        addons: formattedAddons,
        details: userDetails,
      }).unwrap();

      const { orderId, bookingId } = bookingResponse;

      const options = {
        key: process.env.REACT_RAZORPAY_KEY_ID,
        amount: calculateTotalAmount() * 100,
        currency: "INR",
        name: "AVK Raja Yadav Trust Donations",
        description: "Support our community",
        order_id: orderId,

        handler: async (response) => {
          console.log(response, "resp");
          try {
            const verificationResponse = await verifyBooking({
              bookingId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              payment_method: response.method,
            }).unwrap();

            console.log(verificationResponse, "response");

            if (verificationResponse.success) {
              setAlert("Payment successful! Thanks for your booking.");
              setAlertSeverity("success");
              setOpenSnackbar(true);

              setBookingHistory({
                court: courts.find((court) => court._id === selectedCourt)
                  ?.court_name,
                date: selectedDate.format("YYYY-MM-DD"),
                slots: selectedSlots.map((slot) => ({
                  startTime: dayjs(slot.startTime).format("h:mm A"),
                  endTime: dayjs(slot.endTime).format("h:mm A"),
                })),
                addons: selectedAddOns.map((addon) => addon.item_name),
                totalAmount: calculateTotalAmount(),
                status: "Confirmed",
              });

              handleClickOpen();
            }
          } catch (error) {
            setAlert("Payment failed. Please try again.");
            setAlertSeverity("error");
            setOpenSnackbar(true);
            console.log(error.message);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3f51b5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        console.log("Payment Failed:", response.error);
        setProcessing(false);
      });

      paymentObject.open();
    } catch (error) {
      console.log("Booking Error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddOnToggle = (addOn, quantity) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((item) => item._id === addOn._id);

      if (quantity === 0) {
        return prev.filter((item) => item._id !== addOn._id);
      }

      if (exists) {
        return prev.map((item) =>
          item._id === addOn._id ? { ...item, quantity } : item
        );
      }
      return [...prev, { ...addOn, quantity }];
    });
  };

  const handleSlotToggle = (slot) => {
    setSelectedSlots((prevSlots) => {
      const exists = prevSlots.some((s) => s._id === slot._id);
      return exists
        ? prevSlots.filter((s) => s._id !== slot._id)
        : [...prevSlots, slot];
    });
  };

  useEffect(() => {
    if (courts.length > 0) {
      setSelectedCourt(courts[0]._id);
      setSelectedImage(courts[0].court_image);
    }
  }, [courts]);

  const handleCourtChange = (e) => {
    const selectedCourtId = e.target.value;
    const court = courts.find((c) => c._id === selectedCourtId);

    if (court) {
      setSelectedImage(court.court_image);
      setSelectedCourt(court._id);
      setOpenDrawer(true);
    }
  };

  const handleClickOpen = () => {
    if (selectedSlots.length === 0) {
      setAlert("Please select a time slot for booking."); // Set dynamic alert message
      setAlertSeverity("error");
      setOpenSnackbar(true); // Open the snackbar
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setSelectedSlots([]);
    setSelectedAddOns([]);
    setOpen(false);
    setOpenUserDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
          sx={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "10px",
          }}
        >
          <Grid container spacing={2} sx={{ flexWrap: "wrap" }}>
            {/* Booking Section */}
            <Grid
              item
              xs={12}
              md={8}
              container
              spacing={2}
              sx={{
                marginTop: "3px",
                height: { xs: "auto", md: "auto" },
              }}
            >
              {/* Select Court & Date */}
              <Grid item xs={12}>
                <Card
                  sx={{ padding: 3, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Select Court & Date
                  </Typography>
                  {/* Add Ons Button */}
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                      position: "relative",
                      marginTop: 2,
                      width: { xs: "100%", sm: "auto" },
                    }}
                    onClick={handleOpenDrawer}
                  >
                    Add Ons
                  </Button>
                  {/* Date Picker */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={selectedDate}
                      onChange={(newDate) => {
                        setSelectedDate(newDate);
                        setOpen(false);
                      }}
                      minDate={dayjs()}
                      format="DD/MM/YYYY"
                      open={openCalendar}
                      onOpen={() => setOpenCalendar(true)}
                      onClose={() => setOpenCalendar(false)}
                      slots={{
                        textField: (params) => (
                          <TextField
                            {...params}
                            fullWidth
                            onClick={() => setOpenCalendar(true)}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <CalendarToday
                                    style={{ cursor: "pointer" }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        ),
                      }}
                    />
                  </LocalizationProvider>

                  {/* Court Select */}
                  <RadioGroup
                    value={selectedCourt}
                    onChange={handleCourtChange}
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {courtsLoading ? (
                      <Typography>Loading courts...</Typography>
                    ) : (
                      courts?.map((court) => (
                        <FormControlLabel
                          key={court._id}
                          value={court._id}
                          control={<Radio disabled={!court.isActive} />}
                          label={`${court.court_name} ${!court.isActive ? "(Inactive)" : ""
                            }`}
                        />
                      ))
                    )}
                  </RadioGroup>

                  {/* Court Image */}
                  <CardMedia
                    component="img"
                    height="250px"
                    image={`https://res.cloudinary.com/dj0rho12o/image/upload/${selectedImage}`}
                    sx={{
                      marginTop: 2,
                      borderRadius: 2,
                      objectFit: "cover",
                      width: "100%",
                    }}
                    alt="Court Image"
                  />
                </Card>
              </Grid>

              {/* Select Time Slot */}
              <Grid item xs={12}>
                <Card
                  sx={{ padding: 3, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Select Time Slot
                  </Typography>
                  {/* Time Slots Grid */}
                  <Box
                    sx={{
                      overflowY: "auto",
                      maxHeight: { xs: "auto", md: 300 },
                      mt: 2,
                      flexGrow: 1,
                    }}
                  >
                    <Grid container spacing={1}>
                      {isLoading ? (
                        <Typography>Loading slots...</Typography>
                      ) : slots?.length === 0 ? (
                        <Typography>No slots available.</Typography>
                      ) : (
                        slots.map((slot) => {
                          const slotStartTime = moment(slot.startTime).tz("Asia/Kolkata");
                          const isPastSlot = slotStartTime.isBefore(currentTime);
                          const isDisabled = isPastSlot || slot.isBooked;

                          return (
                            <Grid item xs={6} sm={4} md={4} key={slot._id}>
                              <Button
                                fullWidth
                                variant={selectedSlots.some((s) => s._id === slot._id) ? "contained" : "outlined"}
                                color={slot.isBooked ? "error" : "primary"}
                                disabled={isDisabled}
                                onClick={() => handleSlotToggle(slot)}
                              >
                                {slotStartTime.format("hh:mm A")} -{" "}
                                {moment(slot.endTime).tz("Asia/Kolkata").format("hh:mm A")}
                              </Button>
                            </Grid>
                          );
                        })
                      )}
                    </Grid>

                  </Box>
                  {/* Proceed Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2, width: "100%" }}
                    onClick={handleClickOpen}
                  >
                    Proceed to Booking
                  </Button>
                </Card>
              </Grid>
            </Grid>

            {/* DetailsCard Section */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                height: { xs: "auto", md: "auto" },
                marginTop: "3px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <DetailsCard />
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alert}
        </Alert>
      </Snackbar>
      <AddOnsDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        addons={addons}
        selectedAddOns={selectedAddOns}
        onToggle={handleAddOnToggle}
        loading={addonLoading}
      />

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Booking Summary
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            {/* Court Image */}
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                mb: 2,
              }}
              alt="Court"
              src={
                `https://res.cloudinary.com/dj0rho12o/image/upload/${selectedImage}` ||
                "https://via.placeholder.com/400x200?text=No+Image+Available"
              }
            />

            {/* Booking Details */}
            <Typography variant="h6" gutterBottom>
              Selected Court Details
            </Typography>
            <Typography gutterBottom>
              Court:{" "}
              {courts.find((court) => court._id === selectedCourt)?.court_name}
            </Typography>
            <Typography gutterBottom>
              Date: {selectedDate?.format("DD MMMM YYYY")}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Time Slots */}
            <Typography variant="h6" gutterBottom>
              Selected Time Slots
            </Typography>
            {selectedSlots.map((slot, index) => (
              <Typography key={index} gutterBottom>
                {momentTime.utc(slot.startTime).format("hh:mm A")} -{" "}
                {momentTime.utc(slot.endTime).format("hh:mm A")}
                <span style={{ float: "right" }}>₹{slot.price}</span>
              </Typography>
            ))}

            {/* Add-ons if any */}
            {selectedAddOns.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Selected Add-ons
                </Typography>
                {selectedAddOns.map((addon, index) => (
                  <Typography key={index} gutterBottom>
                    {addon.item_name}
                    <span style={{ float: "right" }}>
                      ₹{addon.quantity * addon.price}
                    </span>
                  </Typography>
                ))}
              </>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Total Amount */}
            <Typography variant="h6">
              Total Amount
              <span style={{ float: "right" }}>
                ₹{calculateTotalAmount(false)}
              </span>
            </Typography>
            <Typography variant="h6">
              GST (18%)
              <span style={{ float: "right" }}>
                ₹{(calculateTotalAmount(false) * 18) / 100}
              </span>
            </Typography>

            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Grand Total
              <span style={{ float: "right" }}>
                ₹{calculateTotalAmount(true)}
              </span>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPay}
            variant="contained"
            color="primary"
            disabled={processing}
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* User Details Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}>
        <DialogTitle>Enter Your Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userDetails.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={userDetails.phone}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={userDetails.city}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitDetails}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
};

export default CourtBooking;

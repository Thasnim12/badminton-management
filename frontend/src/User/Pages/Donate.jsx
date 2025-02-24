import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Style,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  useCreateDonationMutation,
  useVerifyDonationMutation,
} from "../../Slices/UserApi";

import {
  getCurrencyName,
  CURRENCY_LIST,
  getCurrencySymbol,
} from "../../Config/CurrencyConfig";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@mui/material/styles";
import Header from "../Global/Header";
import Footer from "../Global/Footer";

const Donate = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorCity, setDonorCity] = useState("");
  const [donationType, setDonationType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [alert, setAlert] = useState(null);

  const [donate] = useCreateDonationMutation();
  const [verifyPayment] = useVerifyDonationMutation();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        setAlert({
          message: "Failed to load payment system. Please try again later.",
          severity: "error",
        });
      };
      document.body.appendChild(script);
    });
  };

  const loggedIn = false;

  const initiateDonation = async () => {
    try {
      setIsLoading(true);

      if (!paymentMethod) {
        setAlert({
          message: "Please enter all fields",
          severity: "error",
          variant: "outlined",
        });
        return;
      }

      if (!amount || parseFloat(amount) < 100) {
        setAlert({
          message: "Minimum Donation amount is 100",
          severity: "error",
        });
        return;
      }
      setOpenDialog(true);
    } catch (error) {
      setAlert({
        message:
          "An error occurred while initiating the donation. Please try again later.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDonorName("");
    setAmount("");
    setPaymentMethod("");
    setDonationType("");
    setDonorCity("");
    setDonorPhone("");
  };

  const handleCloseDialog = () => {
    resetForm();
    setOpenDialog(false);
  };

  const handleDonationSubmit = async () => {
    if (!donorName) {
      setAlert({
        message: "Name is required to proceed with donation",
        severity: "error",
      });
      return;
    }

    try {
      if (typeof window.Razorpay === "undefined") {
        await loadRazorpayScript();
      }

      const donorId = loggedIn ? "user123" : uuidv4();

      const response = await donate({
        donor_id: donorId,
        donor_name: donorName,
        donor_phone: donorPhone,
        donor_city: donorCity,
        donation_type: donationType,
        amount,
        currency,
        paymentMethod,
      }).unwrap();

      const { order } = response;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Awinco Donations",
        description: "Support our community",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            setAlert({ message: verifyRes.message, severity: "success" });
            resetForm();
            navigate("/donate");
          } catch (error) {
            setAlert({
              message:
                "Payment verification failed. Please contact support if amount was deducted.",
              severity: "error",
            });
          }
        },
        prefill: {
          name: donorName,
        },
        modal: {
          ondismiss: () => {
            resetForm();
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setAlert({
        message:
          "An error occurred while initiating the donation. Please try again later.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const HeroSection = styled(Box)(({ theme }) => ({
    width: "100vw",
    height: "400px", // Fixed height
    backgroundImage: 'url("/Carousal3.jpg")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%", // Stretches image to fit width & height
    textAlign: "center",
    padding: "80px 20px",
  
    [theme.breakpoints.down("lg")]: {
      height: "380px", // Slightly reduce for large screens
    },
  
    [theme.breakpoints.down("md")]: {
      height: "350px", // Adjust for medium screens
    },
  
    [theme.breakpoints.down("sm")]: {
      height: "300px", // Reduce height on small screens
      padding: "40px 10px",
    },
  
    [theme.breakpoints.down("xs")]: {
      height: "250px", // Reduce height for extra small screens
      padding: "30px 5px",
    },
  }));
  
  

  const Section = styled(Box)(({ theme }) => ({
    padding: "60px 20px",
    width: "100%",
    textAlign: "center",
    backgroundColor: theme.palette.background.default,
  }));

  return (
    <div>
      <Header />
      <HeroSection />
    
      <Snackbar
        open={!!alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(null)}
      >
        <Alert
          onClose={() => setAlert(null)}
          severity={alert?.severity}
          sx={{ width: "100%" }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
      <Typography variant="h2" color="white">
        Support Our Cause
      </Typography>
      <Container maxWidth="lg" sx={{ padding: "40px 0" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Reason for This Cause
            </Typography>
            <Typography variant="h4" sx={{ marginBottom: "20px" }}>
              How Your Donation Helps
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "left", display: "inline-block" }}
            >
              • Provides medical aid for a child in need. <br />• Helps fund a
              year of education for an underprivileged student. <br />• Supports
              community development projects for a neighborhood.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Donation Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      label="Currency"
                      required
                    >
                      {CURRENCY_LIST.map((curr) => (
                        <MenuItem key={curr.code} value={curr.code}>
                          {curr.name} ({curr.symbol})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                    >
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Debit Card">Debit Card</MenuItem>
                      <MenuItem value="Net Banking">Net Banking</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Button
                    onClick={initiateDonation}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{ padding: "10px 20px" }}
                  >
                    Donate Now
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Enter Your Details</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Your Name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
            />
            <br />
            <br />
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
              required
            />
            <br />
            <br />
            <TextField
              fullWidth
              label="City"
              value={donorCity}
              onChange={(e) => setDonorCity(e.target.value)}
              required
            />
            <br />
            <br />
            <FormControl fullWidth>
              <InputLabel>Donation Type</InputLabel>
              <Select
                value={donationType}
                onChange={(e) => setDonationType(e.target.value)}
                required
              >
                <MenuItem value="education">Sponsor for Education</MenuItem>
                <MenuItem value="welfare">Sponsor for Welfare</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="shelters">Shelters</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDonationSubmit}
              variant="outlined"
              color="success"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </div>
  );
};

export default Donate;

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
        name: "AVK Raja Yadav Trust Donations",
        description: "Support our community",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            setAlert({
              message: `Donation successful! You have donated ₹${verifyRes.order.amount}.`,
              severity: "success",
            });
            resetForm();
            setOpenDialog(false);
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
    height: "calc(100vw / 4.8)", // Maintain 1920x400 aspect ratio (400px height for 1920px width)
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start", // Align image to the top
    overflow: "hidden",
    backgroundImage: 'url("/Carousal3.jpg")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain", // Ensures full image visibility without cropping

    [theme.breakpoints.down("lg")]: {
      height: "calc(100vw / 4.8)",
    },

    [theme.breakpoints.down("md")]: {
      height: "calc(100vw / 4.8)",
    },

    [theme.breakpoints.down("sm")]: {
      height: "calc(100vw / 4.8)",
    },

    [theme.breakpoints.down("xs")]: {
      height: "calc(100vw / 4.8)",
    },
  }));

  const Section = styled(Box)(({ theme }) => ({
    padding: "30px 20px",
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
      <Container maxWidth="lg">
        <Container sx={{ mt: 8 }}>
          {/* Title */}
          <Typography variant="h3" align="center" gutterBottom>
            How Your Donation Helps
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary">
            Your generosity makes a real impact, supporting those in need and
            empowering communities.
          </Typography>

          {/* Donation Form */}
          <Grid container justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ padding: "20px", borderRadius: "10px", mt: 4 }}
              >
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
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="payment-method-label">
                        Payment Method
                      </InputLabel>
                      <Select
                        labelId="payment-method-label"
                        id="payment-method"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        label="Payment Method" // This is important for placeholder behavior
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

          {/* Sections */}

          <Grid container spacing={6} sx={{ mt: 8 }}>
            {[
              {
                title: "Building Hope, One Life at a Time",
                description:
                  "At the heart of every act of kindness lies trust—the foundation of meaningful change. We believe in creating a world where hope isn’t just a word, but a reality for those who need it most.",
                imgSrc:
                  "https://static.vecteezy.com/system/resources/thumbnails/007/112/820/small/silhouette-of-giving-a-helping-hand-hope-and-support-each-other-over-sunset-background-photo.jpg",
              },
              {
                title: "Empowering Communities Through Compassion",
                description:
                  "Charity isn’t just about giving; it’s about empowering. Every contribution you make helps build stronger communities, fostering growth, dignity, and endless possibilities.",
                imgSrc:
                  "https://youthjunctioninc.net.au/wp-content/uploads/2023/07/Untitled_design_1-1.png",
              },
              {
                title: "Transparency You Can Believe In",
                description:
                  "Your trust matters to us. That’s why we ensure complete transparency, so you know exactly how your support is making an impact—turning your generosity into real, lasting change.",
                imgSrc:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0SbNE9Y2q3Bv64QQnYeeVKo61B6nAA3I3ug&s",
              },
              {
                title: "Join Hands, Change Lives",
                description:
                  "Together, we can transform lives and inspire futures. Be a part of something bigger—where every small act of kindness creates ripples of hope across the world.",
                imgSrc:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUxLZSLTj4U7PpHMYcYT8pSChLpR3qwbJCzA&s",
              },
            ].map((section, index) => (
              <Section key={index}>
                <Grid
                  container
                  spacing={4}
                  alignItems="center"
                  direction={index % 2 === 0 ? "row" : "row-reverse"}
                >
                  <Grid
                    item
                    xs={12}
                    md={5}
                    display="flex"
                    justifyContent="center"
                  >
                    <Box
                      component="img"
                      src={section.imgSrc}
                      alt={section.title}
                      sx={{
                        width: "80%",
                        maxWidth: "500px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h4" gutterBottom>
                      {section.title}
                    </Typography>
                    <Typography variant="body1">
                      {section.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Section>
            ))}
          </Grid>
        </Container>

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
            <FormControl fullWidth variant="outlined">
              <InputLabel id="donation-type-label">Donation Type</InputLabel>
              <Select
                labelId="donation-type-label"
                id="donation-type"
                value={donationType}
                onChange={(e) => setDonationType(e.target.value)}
                label="Donation Type" // Ensures floating label behavior
                required
              >
                <MenuItem value="education">Sponsor for Education</MenuItem>
                <MenuItem value="welfare">Sponsor for Underprivileged Children</MenuItem>
                <MenuItem value="books">Sponsor for Books</MenuItem>
                {/* <MenuItem value="shelters">Shelters</MenuItem> */}
              </Select>
            </FormControl>

            <br />
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDonationSubmit}
              variant="contained"
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

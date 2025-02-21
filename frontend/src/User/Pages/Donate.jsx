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
        key: process.env.REACT_RAZORPAY_KEY_ID,
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
      <Container maxWidth="lg" >
        <Container sx={{ mt: 8 }}>
          {/* Title */}
          <Typography variant="h3" align="center" gutterBottom>
            How Your Donation Helps
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
           
          >
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
                  "data:image/jpeg;base64,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",
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

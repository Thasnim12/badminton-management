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
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar, // Import Snackbar
  Alert, // Import Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  useCreateDonationMutation,
  useVerifyDonationMutation,
} from "../../Slices/UserApi";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@mui/material/styles";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import {
  getCurrencyName,
  CURRENCY_LIST,
  getCurrencySymbol,
} from "../../Config/CurrencyConfig";

const Donate = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [donorName, setDonorName] = useState("");
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

      if (!amount || !paymentMethod) {
        setAlert({
          message: "Please enter all fields",
          severity: "error",
          variant: "outlined",
        });
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        setAlert({
          message: "Please enter a valid donation amount",
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
            navigate("/donation-success");
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
    backgroundImage: 'url("/Carousal3.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "80px 20px",
    color: "white",
    height: "400px",
    textAlign: "center",
    width: "100%",
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
      <Section>
        <Container maxWidth="lg" sx={{ padding: "40px 0" }}>
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

          <Grid container spacing={4} alignItems="center">
            {/* Left Side: Donation Information */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                  How Your Donation Helps
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ textAlign: "left", display: "inline-block" }}
                >
                  • Provides medical aid for a child in need. <br />
                  • Helps fund a year of education for an underprivileged
                  student. <br />• Supports community development projects for a
                  neighborhood.
                </Typography>
              </Box>
            </Grid>

            {/* Right Side: Donation Form */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ padding: "20px", borderRadius: "10px" }}
              >
                <form onSubmit={(e) => e.preventDefault()}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Donation Amount"
                        type="number"
                        variant="outlined"
                         value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        inputProps={{ min: "1" }}
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
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          label="Payment Method"
                          required
                        >
                          <MenuItem value="Credit Card">Credit Card</MenuItem>
                          <MenuItem value="Debit Card">Debit Card</MenuItem>
                          <MenuItem value="UPI">UPI</MenuItem>
                          <MenuItem value="Net Banking">Net Banking</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                    <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                      Amount: {getCurrencySymbol(currency)} {amount}
                    </Typography>
                    <Button
                      onClick={initiateDonation}
                      variant="outlined"
                      color="primary"
                      disabled={isLoading}
                      sx={{ padding: "10px 20px", fontSize: "16px" }}
                    >
                      Donate Now
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Grid>
          </Grid>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Enter Your Name</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                fullWidth
                label="Your Name"
                variant="outlined"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleDonationSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Section>

      <Footer />
    </div>
  );
};

export default Donate;

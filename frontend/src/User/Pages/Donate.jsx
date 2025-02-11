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
  Section,
  DialogActions,
  DialogContent,
  DialogTitle,
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

  const [donate] = useCreateDonationMutation();
  const [verifyPayment] = useVerifyDonationMutation();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        alert("Failed to load payment system. Please try again later.");
      };
      document.body.appendChild(script);
    });
  };

  const loggedIn = false;

  const initiateDonation = async () => {
    try {
      setIsLoading(true);

      if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid donation amount");
        return;
      }

      // Open the dialog to prompt for donor name
      setOpenDialog(true);
    } catch (error) {
      alert(
        "An error occurred while initiating the donation. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonationSubmit = async () => {
    if (!donorName) {
      alert("Name is required to proceed with donation");
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
      }).unwrap();

      const { order } = response;

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
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

            alert(verifyRes.message);
            navigate("/donation-success");
          } catch (error) {
            alert(
              "Payment verification failed. Please contact support if amount was deducted."
            );
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
      alert(
        "An error occurred while initiating the donation. Please try again later."
      );
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
    marginTop: "5px",
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
        <Container maxWidth="md" sx={{ padding: "40px 0" }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", marginBottom: "20px" }}
          >
            How Your Donation Helps
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "20px", textAlign: "center" }}
          >
            • Provides medical aid for a child in need. <br />
            • Helps fund a year of education for an underprivileged student.{" "}
            <br />• Supports community development projects for a neighborhood.
          </Typography>

          {/* Donation Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ padding: "10px 20px", fontSize: "16px" }}
              >
                {isLoading ? "Processing..." : "Donate Now"}
              </Button>
            </Box>
          </form>
        </Container>

        {/* Dialog for Donor Name */}
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
      </Section>
      <Footer />
    </div>
  );
};

export default Donate;

import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../Global/Header";
import Footer from "../Global/Footer"
const Donate = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleDonate = (e) => {
    e.preventDefault();
    alert(`Donation successful! Amount: ₹${amount}, Payment Method: ${paymentMethod}`);
  };

  return (
    <div>
    <Header />
    <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "87vh",
        }}
      >
    <Container maxWidth="md" sx={{ padding: "40px 0" }}>
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "20px" }}>
        Support the Cause
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Your contribution can change lives. By donating to AVK Raja Yadav Trust, you are helping us continue to organize tournaments and provide support to individuals in need.
      </Typography>

      <Typography variant="h6" sx={{ marginBottom: "15px" }}>
        How Your Donation Helps:
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: "20px" }}>
        • Provides medical aid for a child in need. <br />
        • Helps fund a year of education for an underprivileged student. <br />
        • Supports community development projects for a neighborhood.
      </Typography>

      <form onSubmit={handleDonate}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Donation Amount (₹)"
              type="number"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Donate Now
          </Button>
        </Box>
      </form>
    </Container>
    </div>
    <Footer/>
    </div>
  );
};

export default Donate;

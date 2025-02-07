import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Modal,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import Header from "../Global/Header";
import Footer from "../Global/Footer";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  marginBottom: "30px",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: "bold",
  marginBottom: "20px",
  color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: "10px",
  borderRadius: "12px",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const BookingPage = () => {
  const [court, setCourt] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [racket, setRacket] = useState(false);
  const [cork, setCork] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const handleBooking = () => {
    if (!court || !date || !timeSlot) {
      enqueueSnackbar("Please fill in all the required fields.", {
        variant: "error",
      });
      return;
    }
    setOpenSummary(true);
  };

  const handleAddOnsChange = () => {
    let price = 200; // Base price for court booking
    if (racket) price += 50; // Racket rental price
    if (cork) price += 20; // Cork price
    setTotalPrice(price);
  };

  const handleConfirmBooking = () => {
    enqueueSnackbar("Booking Confirmed!", { variant: "success" });
    // Logic for confirming the booking and proceeding to payment
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "87vh",
        }}
      >
        <Container
          maxWidth="md"
          style={{ marginTop: "50px", paddingBottom: "50px" }}
        >
          <StyledCard>
            <CardContent>
              <SectionTitle variant="h4">
                Book Your Badminton Court
              </SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Choose Court</InputLabel>
                    <Select
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                      label="Choose Court"
                    >
                      <MenuItem value="Court 1">Court 1</MenuItem>
                      <MenuItem value="Court 2">Court 2</MenuItem>
                      <MenuItem value="Court 3">Court 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Select Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Choose Time Slot</InputLabel>
                    <Select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      label="Choose Time Slot"
                    >
                      <MenuItem value="6-7">6 PM - 7 PM</MenuItem>
                      <MenuItem value="7-8">7 PM - 8 PM</MenuItem>
                      <MenuItem value="8-9">8 PM - 9 PM</MenuItem>
                      <MenuItem value="9-10">9 PM - 10 PM</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <StyledButton onClick={handleBooking}>
                    Proceed to Add-Ons
                  </StyledButton>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>

          {/* Booking Summary Modal */}
          <Modal open={openSummary} onClose={() => setOpenSummary(false)}>
            <Box
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                width: "400px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Add Extra Services
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={racket}
                    onChange={() => setRacket(!racket)}
                    color="primary"
                  />
                }
                label="Racket Rental"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cork}
                    onChange={() => setCork(!cork)}
                    color="primary"
                  />
                }
                label="Cork"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddOnsChange}
                style={{ marginTop: "20px" }}
              >
                Update Price
              </Button>

              <Box style={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="h6">Total Price: ₹{totalPrice}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleConfirmBooking}
                  style={{ marginTop: "10px" }}
                >
                  Confirm Booking
                </Button>
              </Box>
            </Box>
          </Modal>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;

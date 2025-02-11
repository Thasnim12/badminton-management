import React, { useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Paper,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { Calendar } from "react-calendar";
import Layout from "../Global/Layouts";

const ManageCourts = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    playerName: "",
    time: "",
    courtNumber: "",
    price: "",
  });

  const [courtBookings, setCourtBookings] = useState([
    { courtNumber: 1, playerName: "Alice", time: "10:00 AM" },
    { courtNumber: 2, playerName: "Bob", time: "12:00 PM" },
  ]);

  const [courtPrices, setCourtPrices] = useState({
    1: 50, // Price per hour for Court 1
    2: 60, // Price per hour for Court 2
    3: 70, // Price per hour for Court 3
    4: 80, // Price per hour for Court 4
  });

  const [courtAvailability, setCourtAvailability] = useState({
    1: { "2025-02-07": true, "2025-02-08": false }, // Court 1 availability
    2: { "2025-02-07": true, "2025-02-08": true }, // Court 2 availability
    3: { "2025-02-07": false, "2025-02-08": true }, // Court 3 availability
    4: { "2025-02-07": true, "2025-02-08": true }, // Court 4 availability
  });

  const handleModalClose = () => {
    setOpenModal(false);
    setBookingDetails({ playerName: "", time: "", courtNumber: "", price: "" });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleAddBooking = () => {
    setCourtBookings([...courtBookings, bookingDetails]);
    handleModalClose();
  };

  const handleDeleteBooking = (courtNumber) => {
    setCourtBookings(courtBookings.filter((booking) => booking.courtNumber !== courtNumber));
    handleDialogClose();
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handlePriceChange = (courtNumber, value) => {
    setCourtPrices((prevPrices) => ({
      ...prevPrices,
      [courtNumber]: value,
    }));
  };

  const handleAvailabilityChange = (courtNumber, date, available) => {
    setCourtAvailability((prevAvailability) => ({
      ...prevAvailability,
      [courtNumber]: {
        ...prevAvailability[courtNumber],
        [date]: available,
      },
    }));
  };

  return (
    <Layout>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Badminton Court Bookings
        </Typography>

        {/* Calendar */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
          <Calendar />
        </Box>

        {/* Court Bookings Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Court Number</TableCell>
                <TableCell>Player Name</TableCell>
                <TableCell>Booking Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courtBookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>{booking.courtNumber}</TableCell>
                  <TableCell>{booking.playerName}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => setSelectedCourt(booking)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedCourt(booking);
                        setOpenDialog(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add New Booking Button */}
        <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Add New Booking
          </Button>
        </Box>

        {/* Add Booking Modal */}
        <Modal open={openModal} onClose={handleModalClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add New Court Booking
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <TextField
              fullWidth
              label="Player Name"
              name="playerName"
              value={bookingDetails.playerName}
              onChange={handleBookingChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Booking Time"
              name="time"
              value={bookingDetails.time}
              onChange={handleBookingChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Court Number</InputLabel>
              <Select
                name="courtNumber"
                value={bookingDetails.courtNumber}
                onChange={handleBookingChange}
                label="Court Number"
              >
                {[1, 2, 3, 4].map((number) => (
                  <MenuItem key={number} value={number}>
                    Court {number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price per Hour"
              name="price"
              value={bookingDetails.price}
              onChange={handleBookingChange}
              margin="normal"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button variant="contained" onClick={handleAddBooking}>
                Add Booking
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Booking Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this booking?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteBooking(selectedCourt?.courtNumber)}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Court Pricing Management */}
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Manage Court Pricing
          </Typography>
          {[1, 2, 3, 4].map((courtNumber) => (
            <Box key={courtNumber} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                Court {courtNumber} - Price:
              </Typography>
              <TextField
                value={courtPrices[courtNumber]}
                onChange={(e) => handlePriceChange(courtNumber, e.target.value)}
                label="Price"
                type="number"
                variant="outlined"
                size="small"
                sx={{ width: "100px" }}
              />
            </Box>
          ))}
        </Box>

        {/* Court Availability Management */}
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Manage Court Availability
          </Typography>
          {[1, 2, 3, 4].map((courtNumber) => (
            <Box key={courtNumber} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                Court {courtNumber} - Availability:
              </Typography>
              <Select
                value={courtAvailability[courtNumber]["2025-02-07"]}
                onChange={(e) =>
                  handleAvailabilityChange(courtNumber, "2025-02-07", e.target.value)
                }
                label="Available"
                sx={{ width: "100px" }}
              >
                <MenuItem value={true}>Available</MenuItem>
                <MenuItem value={false}>Unavailable</MenuItem>
              </Select>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default ManageCourts;

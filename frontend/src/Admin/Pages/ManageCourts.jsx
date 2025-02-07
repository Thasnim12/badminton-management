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
import { Calendar } from "react-calendar"; // Optional: You can use a calendar package
import Layout from "../Global/Layouts";
const ManageCourts = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    playerName: "",
    time: "",
    courtNumber: "",
  });
  const [courtBookings, setCourtBookings] = useState([
    { courtNumber: 1, playerName: "Alice", time: "10:00 AM" },
    { courtNumber: 2, playerName: "Bob", time: "12:00 PM" },
  ]);

  const handleModalClose = () => {
    setOpenModal(false);
    setBookingDetails({ playerName: "", time: "", courtNumber: "" });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleAddBooking = () => {
    setCourtBookings([...courtBookings, bookingDetails]);
    handleModalClose();
  };

  const handleDeleteBooking = (courtNumber) => {
    setCourtBookings(
      courtBookings.filter((booking) => booking.courtNumber !== courtNumber)
    );
    handleDialogClose();
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  return (
    <Layout>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Badminton Court Bookings
        </Typography>

        {/* Calendar */}
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}
        >
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
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
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
            <Typography>
              Are you sure you want to delete this booking?
            </Typography>
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
      </Box>
    </Layout>
  );
};

export default ManageCourts;

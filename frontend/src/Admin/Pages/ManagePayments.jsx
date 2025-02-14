import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Dialog,
  Card,
  Grid,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination, // Import MUI Pagination
} from "@mui/material";
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Layout from "../Global/Layouts";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useGetDonationsQuery } from "../../Slices/AdminApi";

const ManagePayments = () => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [donationPage, setDonationPage] = useState(1);
  const [donationRowsPerPage, setDonationRowsPerPage] = useState(5);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingRowsPerPage, setBookingRowsPerPage] = useState(5);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  const handleOpenDetails = (donation) => {
    setSelectedDonation(donation);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedDonation(null);
  };

  const handleDonationChangePage = (event, value) => setDonationPage(value);
  const handleDonationChangeRowsPerPage = (event) => {
    setDonationRowsPerPage(parseInt(event.target.value, 10));
    setDonationPage(1);
  };

  const handleBookingChangePage = (event, value) => setBookingPage(value);
  const handleBookingChangeRowsPerPage = (event) => {
    setBookingRowsPerPage(parseInt(event.target.value, 10));
    setBookingPage(1);
  };

  const { data: donations } = useGetDonationsQuery();
  const donationHistory = donations || [];

  const donationProfit =
    donations
      ?.filter((donation) => donation.payment_status === "completed")
      .reduce((total, donation) => total + donation.amount, 0) || 0;

  const bookingHistory = [
    { id: 1, amount: 150, customer: "Alice Johnson", date: "2025-02-05" },
    { id: 2, amount: 250, customer: "Bob Lee", date: "2025-01-18" },
  ];

  const BookingProfit =
    bookingHistory?.reduce((total, booking) => total + booking.amount, 0) || 0;

  const totalProfit = donationProfit + BookingProfit;

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
        <Box sx={{ marginBottom: 3 }}>
          
          {/* Displaying profit cards */}
          <Grid container spacing={3} sx={{ marginBottom: 3 }}>
            <Grid item xs={4}>
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}
        >
          <CurrencyRupeeOutlinedIcon sx={{ mr: 1 }} />
          Total Profit
        </Typography>
        <Typography variant="h6">₹{totalProfit}</Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={4}>
    <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}
        >
          <VolunteerActivismIcon sx={{ mr: 1 }} />
          Profit from Donations
        </Typography>
        <Typography variant="h6">₹{donationProfit}</Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={4}>
    <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}
        >
          <EventNoteIcon sx={{ mr: 1 }} />
          Profit from Bookings
        </Typography>
        <Typography variant="h6">₹{BookingProfit}</Typography>
      </CardContent>
    </Card>
            </Grid>
          </Grid>
        </Box>

        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Donations" />
          <Tab label="Bookings" />
        </Tabs>

        {tabIndex === 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Donation History</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Donor Name</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Currency</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Payment Method</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donationHistory
                  .slice(
                    (donationPage - 1) * donationRowsPerPage,
                    donationPage * donationRowsPerPage
                  )
                  .map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell align="center">
                        {donation.donor_name}
                      </TableCell>
                      <TableCell align="center">{donation.amount}</TableCell>
                      <TableCell align="center">{donation.currency}</TableCell>
                      <TableCell align="center">
                        {donation.payment_status}
                      </TableCell>
                      <TableCell align="center">
                        {donation.payment_method}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          sx={{ marginRight: 1 }}
                          onClick={() => handleOpenDetails(donation)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <Pagination
              count={Math.ceil(donationHistory.length / donationRowsPerPage)}
              page={donationPage}
              onChange={handleDonationChangePage}
              color="primary"
              siblingCount={1}
            />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Booking History</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Customer</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingHistory
                  .slice(
                    (bookingPage - 1) * bookingRowsPerPage,
                    bookingPage * bookingRowsPerPage
                  )
                  .map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell align="center">{booking.customer}</TableCell>
                      <TableCell align="center">₹{booking.amount}</TableCell>
                      <TableCell align="center">{booking.date}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* MUI Pagination for Bookings */}
            <Pagination
              count={Math.ceil(bookingHistory.length / bookingRowsPerPage)}
              page={bookingPage}
              onChange={handleBookingChangePage}
              color="primary"
              siblingCount={1}
            />
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Donation Details</DialogTitle>
          <DialogContent>
            {selectedDonation && (
              <>
                <Typography>
                  <strong>Donor:</strong> {selectedDonation.donor_name}
                </Typography>
                <Typography>
                  <strong>Amount:</strong> {selectedDonation.amount}
                </Typography>
                <Typography>
                  <strong>Currency:</strong> {selectedDonation.currency}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {selectedDonation.payment_status}
                </Typography>
                <Typography>
                  <strong>Payment Method:</strong>{" "}
                  {selectedDonation.payment_method}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedDonation.created_at).toLocaleDateString()}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ManagePayments;

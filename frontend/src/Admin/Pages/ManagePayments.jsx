import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Layout from "../Global/Layouts"; // Adjust the import path based on your directory structure
import { useGetDonationsQuery } from "../../Slices/AdminApi";
const ManagePayments = () => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // State to manage the active tab

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue); // Change the active tab when clicked
  };
  const handleOpenDetails = (donation) => {
    setSelectedDonation(donation);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedDonation(null);
  };

  const { data: donations, error, isLoading } = useGetDonationsQuery();
  const totalDonations =
    donations?.reduce((acc, donation) => acc + donation.amount, 0) || 0;
  const donationHistory = [
    { id: 1, amount: 100, donor: "John Doe", date: "2025-02-12" },
    { id: 2, amount: 200, donor: "Jane Smith", date: "2025-01-22" },
    // Add more donations...
  ];

  const bookingHistory = [
    { id: 1, amount: 150, customer: "Alice Johnson", date: "2025-02-05" },
    { id: 2, amount: 250, customer: "Bob Lee", date: "2025-01-18" },
    // Add more bookings...
  ];

  // Calculate profits (replace these with dynamic calculations based on data)
  const totalProfit =
    donationHistory.reduce((acc, curr) => acc + curr.amount, 0) +
    bookingHistory.reduce((acc, curr) => acc + curr.amount, 0);
  const donationProfit = donationHistory.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const bookingProfit = bookingHistory.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return (
    <Layout>
      <Container>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h4">Manage Payments</Typography>
        </Box>
        {/* Displaying profit cards */}
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Profit</Typography>
                <Typography variant="h4">${totalProfit}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Profit from Donations</Typography>
                <Typography variant="h4">₹{totalDonations}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Profit from Bookings</Typography>
                <Typography variant="h4">${bookingProfit}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Tabs for Donation and Booking History */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Donations" />
          <Tab label="Bookings" />
        </Tabs>
        {/* Tab Content */}
        {tabIndex === 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Donation History</Typography>
            {donationHistory.length === 0 ? (
              <Typography>No donation history available.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1">Donor Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Amount</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Currency</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Status</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Payment Method</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Date</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Actions</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donations?.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{donation.donor_name}</TableCell>
                      <TableCell>{donation.amount}</TableCell>
                      <TableCell>{donation.currency}</TableCell>
                      <TableCell>{donation.payment_status}</TableCell>
                      <TableCell>{donation.payment_method}</TableCell>
                      <TableCell>
                        {new Date(donation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenDetails(donation)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
        {tabIndex === 1 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Booking History</Typography>
            {bookingHistory.length === 0 ? (
              <Typography>No booking history available.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1">Customer</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Amount</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">Date</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingHistory.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.customer}</TableCell>
                      <TableCell>${booking.amount}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default ManagePayments;

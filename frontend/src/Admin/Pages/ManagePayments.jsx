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
  TablePagination, // Import MUI Pagination
  Pagination,
} from "@mui/material";
import BreadcrumbNav from "../Global/Breadcrumb";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Layout from "../Global/Layouts";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  useGetDonationsQuery,
  useGetBookingsQuery,
} from "../../Slices/AdminApi";

const ManagePayments = () => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [donationPage, setDonationPage] = useState(1);
  const [donationRowsPerPage] = useState(7); // Fixed rows per page

  const [bookingPage, setBookingPage] = useState(1);
  const [bookingRowsPerPage] = useState(7); // Fixed rows per page

  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  const handleOpenDetails = (donation) => {
    setSelectedDonation(donation);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedDonation(null);
  };

  const handleDonationPageChange = (event, value) => {
    setDonationPage(value);
  };

  const handleBookingPageChange = (event, value) => {
    setBookingPage(value);
  };

  const { data: donations } = useGetDonationsQuery();
  const donationHistory = donations || [];

  const { data: bookings } = useGetBookingsQuery(); // Fetch bookings
  const bookingHistory = bookings?.bookings || []; // Assuming response contains 'bookings'

  const totalBookings = bookingHistory.length;

  const donationProfit =
    donations
      ?.filter((donation) => donation.payment_status === "completed")
      .reduce((total, donation) => total + donation.amount, 0) || 0;

  const BookingProfit =
    bookingHistory
      ?.filter((booking) => booking?.payment?.status === "Completed")
      .reduce((total, booking) => total + booking?.payment?.amount, 0) || 0;

  const totalProfit = donationProfit + BookingProfit;

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
        <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Payments", path: "/admin/manage-payments" },
          ]}
        />
        <Box sx={{ marginBottom: 3, px: 2 }}>
          {/* Displaying profit cards */}
          <Grid
            container
            spacing={3}
            sx={{ marginBottom: 3 }}
            justifyContent="center"
          >
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CurrencyRupeeOutlinedIcon sx={{ mr: 1 }} />
                    Total Profit
                  </Typography>
                  <Typography variant="h6">₹{totalProfit}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VolunteerActivismIcon sx={{ mr: 1 }} />
                    Donations Profit
                  </Typography>
                  <Typography variant="h6">₹{donationProfit}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EventNoteIcon sx={{ mr: 1 }} />
                    Bookings Profit
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Donation History
            </Typography>

            {/* Responsive Table Wrapper */}
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Donor Name</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Currency</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Payment Method</TableCell>
                    <TableCell align="center">Date</TableCell>
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
                        <TableCell align="center">
                          {donation.currency}
                        </TableCell>
                        <TableCell align="center">
                          {donation.payment_status}
                        </TableCell>
                        <TableCell align="center">
                          {donation.payment_method || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>

            {/* Pagination */}
            {donationHistory.length > donationRowsPerPage && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={Math.ceil(
                    donationHistory.length / donationRowsPerPage
                  )}
                  page={donationPage}
                  onChange={handleDonationPageChange}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Booking History
            </Typography>

            {/* Responsive Table Wrapper */}
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Booking ID</TableCell>
                    <TableCell align="center">Customer Name</TableCell>
                    <TableCell align="center">Court</TableCell>
                    <TableCell align="center">Slot Time</TableCell>
                    <TableCell align="center">Booking Date</TableCell>
                    <TableCell align="center">Payment Status</TableCell>
                    <TableCell align="center">Payment Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingHistory
                    .slice(
                      (bookingPage - 1) * bookingRowsPerPage,
                      bookingPage * bookingRowsPerPage
                    )
                    .map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell align="center">
                          {booking.payment?.razorpayOrderId || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {booking.user?.name || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {booking.court?.court_name || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {booking.slot
                            ?.map(
                              (s) =>
                                `${new Date(s.startTime).toLocaleTimeString()} - ${new Date(s.endTime).toLocaleTimeString()}`
                            )
                            .join(", ") || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          {booking.payment?.status || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {booking.payment?.method || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>

            {/* Pagination */}
            {bookingHistory.length > bookingRowsPerPage && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={Math.ceil(bookingHistory.length / bookingRowsPerPage)}
                  page={bookingPage}
                  onChange={handleBookingPageChange}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
            <Button onClick={handleClose} variant="outlined" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ManagePayments;

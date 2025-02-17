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
        <Box sx={{ marginBottom: 3 }}>
          {/* Displaying profit cards */}
          <Grid container spacing={3} sx={{ marginBottom: 3 }}>
            <Grid item xs={4}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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

            <Grid item xs={4}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                    Profit from Donations
                  </Typography>
                  <Typography variant="h6">₹{donationProfit}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                  {/* <TableCell align="center">Actions</TableCell> */}
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
                        {donation.payment_method || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </TableCell>
                      {/* <TableCell align="center">
                        <IconButton
                          color="primary"
                          sx={{ marginRight: 1 }}
                          onClick={() => handleOpenDetails(donation)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Pagination
                count={Math.ceil(donationHistory.length / donationRowsPerPage)}
                page={donationPage}
                onChange={handleDonationChangePage}
                color="primary"
                siblingCount={1}
              />
            </Box>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Booking History</Typography>
            <Table>
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
                {bookingHistory.length > 0 ? (
                  bookingHistory
                    .slice(
                      (bookingPage - 1) * bookingRowsPerPage,
                      bookingPage * bookingRowsPerPage
                    )
                    .map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell align="center">
                          {booking.payment?.razorpayOrderId}
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
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No Bookings Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination
              count={Math.ceil(totalBookings / bookingRowsPerPage)}
              page={bookingPage}
              onChange={handleBookingChangePage}
              rowsPerPage={bookingRowsPerPage}
              color="primary"
              onRowsPerPageChange={handleBookingChangeRowsPerPage}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />{" "}
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

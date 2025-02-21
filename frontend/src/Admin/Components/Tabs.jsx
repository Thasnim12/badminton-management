import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Pagination,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useManageCsvMutation, useGetBookingsQuery } from "../../Slices/AdminApi";

const RECORDS_PER_PAGE = 7; // Limit to 7 records per page

export default function ScrollableTabsButtonVisible() {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const [manageCsv] = useManageCsvMutation();
  const { data, isLoading: isLoadingBookings } = useGetBookingsQuery();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(1); // Reset to first page when switching tabs
  };

  const handleDownload = async () => {
    try {
      const response = await manageCsv().unwrap();
      if (!response || !(response instanceof Blob)) {
        throw new Error("Invalid CSV response");
      }
      const blob = new Blob([response], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bookings.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const filterBookings = (status) =>
    data?.bookings?.filter((b) => b.payment?.status === status) || [];

  const summaryBookings = data?.bookings || [];
  const pendingBookings = filterBookings("Pending");
  const completedBookings = filterBookings("Completed");
  const failedBookings = filterBookings("Failed");

  const tabStatusMapping = {
    0: summaryBookings,
    1: pendingBookings,
    2: completedBookings,
    3: failedBookings,
  };

  const selectedBookings = tabStatusMapping[value] || [];
  const totalRecords = selectedBookings.length;

  // Pagination Logic
  const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);
  const paginatedBookings = selectedBookings.slice(
    (page - 1) * RECORDS_PER_PAGE,
    page * RECORDS_PER_PAGE
  );

  const renderTable = (bookings = []) => (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">User</TableCell>
            <TableCell align="center">Court</TableCell>
            <TableCell align="center">Slot Time</TableCell>
            <TableCell align="center">Booking Date</TableCell>
            <TableCell align="center">Payment Method</TableCell>
            <TableCell align="center">Payment Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell align="center">
                  {booking.payment?.razorpayOrderId}
                </TableCell>
                <TableCell align="center">{booking.user?.name || "N/A"}</TableCell>
                <TableCell align="center">{booking.court?.court_name || "N/A"}</TableCell>
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
                <TableCell align="center">{booking.payment?.method || "N/A"}</TableCell>
                <TableCell align="center">{booking.payment?.status || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No Bookings Available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", m: { xs: 2, sm: 5 } }}>
    {isLoadingBookings ? (
      <Typography variant="h6" align="center">
        Loading bookings...
      </Typography>
    ) : (
      <>
        {/* Download Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            startIcon={<FileDownloadIcon />}
            onClick={handleDownload}
            sx={{
              ml: 1,
              backgroundColor: "#2c387e",
              color: "white",
              width: { xs: "100%", sm: "auto" }, // Full width on mobile
            }}
          >
            Download CSV
          </Button>
        </Box>
  
        {/* Booking Summary Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          {[
            { label: "Total Bookings", value: summaryBookings.length },
            { label: "Pending Bookings", value: pendingBookings.length },
            { label: "Completed Bookings", value: completedBookings.length },
            { label: "Failed Bookings", value: failedBookings.length },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: "center", py: 2 }}>
                <CardContent>
                  <Typography variant="h6">{stat.label}</Typography>
                  <Typography variant="h4">{stat.value || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
  
        {/* Tabs */}
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="Booking Tabs"
          sx={{ mb: 2 }}
        >
          <Tab label="Summary" />
          <Tab label="Pending" />
          <Tab label="Completed" />
          <Tab label="Failed" />
        </Tabs>
  
        {/* Table */}
        <Box sx={{ overflowX: "auto" }}>{renderTable(paginatedBookings)}</Box>
  
        {/* Pagination */}
        {totalRecords > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              color="primary"
              onChange={(event, value) => setPage(value)}
            />
          </Box>
        )}
      </>
    )}
  </Box>
  
  );
}

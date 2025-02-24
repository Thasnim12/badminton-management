import { useUserBookingQuery } from "../../Slices/UserApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Box,
  Pagination,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { useState } from "react";

const BookingHistory = () => {
  const { data: bookingHistory, isLoading, error } = useUserBookingQuery();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  if (isLoading) return <CircularProgress />;
  if (error || !bookingHistory?.data)
    return <Typography>No booking history available</Typography>;

  const userBookings = bookingHistory.data.map(
    ({ _id, court, slot, payment, bookingDate }) => ({
      key: _id,
      courtName: court?.court_name,
      slots: slot
        .map(
          ({ startTime, endTime }) =>
            `${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()}`
        )
        .join(", "),
      amount: `${payment?.currency} ${payment?.amount}`,
      status: payment?.status,
      date: new Date(bookingDate).toLocaleDateString(),
    })
  );

  // Pagination Logic
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const paginatedData = userBookings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Function to download booking history as CSV
  const downloadCSV = () => {
    const csvContent =
      "Court,Slots,Amount,Status,Booking Date\n" +
      userBookings
        .map(
          ({ courtName, slots, amount, status, date }) =>
            `${courtName},${slots},${amount},${status},${date}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Booking_History.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid sx={{ padding: 3, margin: "auto", maxWidth: 800 }}>
        <Typography variant="h5" gutterBottom>
          My Booking History
        </Typography>

        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadCSV}
            >
              Download CSV
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Court</strong>
                </TableCell>
                <TableCell>
                  <strong>Slots</strong>
                </TableCell>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Booking Date</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map(
                ({ key, courtName, slots, amount, status, date }) => (
                  <TableRow key={key}>
                    <TableCell>{courtName}</TableCell>
                    <TableCell>{slots}</TableCell>
                    <TableCell>{amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={status}
                        color={status === "Paid" ? "success" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{date}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination in the center */}
        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
          <Pagination
            count={Math.ceil(userBookings.length / rowsPerPage)}
            color="primary"
            page={page}
            onChange={handleChangePage}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingHistory;

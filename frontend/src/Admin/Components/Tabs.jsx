import * as React from "react";
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
  IconButton,
  Button,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  useManageCsvMutation,
  useGetBookingsQuery,
} from "../../Slices/AdminApi";

export default function ScrollableTabsButtonVisible() {
  const [value, setValue] = React.useState(0);
  const [manageCsv] = useManageCsvMutation();
  const { data, isLoading: isLoadingBookings } = useGetBookingsQuery();
  console.log(data, "boo");

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const pendingBookings = data?.bookings?.filter(
    (b) => b.payment?.status === "Pending"
  );
  const completedBookings = data?.bookings?.filter(
    (b) => b.payment?.status === "Completed"
  );
  const failedBookings = data?.bookings?.filter(
    (b) => b.payment?.status === "Failed"
  );
  const summaryBookings = data?.bookings;

  const totalBookings = summaryBookings?.length;
  const totalPending = pendingBookings?.length;
  const totalCompleted = completedBookings?.length;
  const totalFailed = failedBookings?.length;

  const tabStatusMapping = {
    0: summaryBookings,
    1: pendingBookings,
    2: completedBookings,
    3: failedBookings,
  };

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
                  {booking.payment?.method || "N/A"}
                </TableCell>
                <TableCell align="center">
                  {booking.payment?.status || "N/A"}
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
    </TableContainer>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", margin: 5 }}>
      {/* Show loading state */}
      {isLoadingBookings ? (
        <Typography variant="h6" align="center">
          Loading bookings...
        </Typography>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              startIcon={<FileDownloadIcon />}
              onClick={handleDownload}
              sx={{ ml: 1, backgroundColor: "#2c387e", color: "white" }}
            >
              Download CSV
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ marginBottom: 3 }}>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center">
                    Total Bookings
                  </Typography>
                  <Typography variant="h4" align="center">
                    {totalBookings || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center">
                    Pending Bookings
                  </Typography>
                  <Typography variant="h4" align="center">
                    {totalPending || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center">
                    Completed Bookings
                  </Typography>
                  <Typography variant="h4" align="center">
                    {totalCompleted || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center">
                    Failed Bookings
                  </Typography>
                  <Typography variant="h4" align="center">
                    {totalFailed || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            aria-label="Booking Tabs"
          >
            <Tab label="Summary" />
            <Tab label="Pending" />
            <Tab label="Completed" />
            <Tab label="Failed" />
          </Tabs>

          {/* Ensure bookings are always an array */}
          {renderTable(tabStatusMapping[value] || [])}
        </>
      )}
    </Box>
  );
}

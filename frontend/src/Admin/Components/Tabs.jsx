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
} from "@mui/material";

export default function ScrollableTabsButtonVisible() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const bookings = {
    summary: [
      { id: 1, name: "John Doe", status: "Pending", date: "2024-02-10" },
      { id: 2, name: "Jane Smith", status: "Completed", date: "2024-02-08" },
    ],
    pending: [{ id: 3, name: "Michael Brown", status: "Pending", date: "2024-02-11" }],
    completed: [{ id: 4, name: "Emily Johnson", status: "Completed", date: "2024-02-07" }],
    failed: [{ id: 5, name: "Chris Wilson", status: "Failed", date: "2024-02-09" }],
  };

  // Calculate the total counts for each status
  const totalBookings = bookings.summary.length;
  const totalPending = bookings.pending.length;
  const totalCompleted = bookings.completed.length;
  const totalFailed = bookings.failed.length;

  const renderTable = (status) => (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings[status].map((booking) => (
            <TableRow key={booking.id}>
              <TableCell align="center">{booking.id}</TableCell>
              <TableCell align="center">{booking.name}</TableCell>
              <TableCell align="center">{booking.status}</TableCell>
              <TableCell align="center">{booking.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", margin: 5 }}>
    
      {/* Grid for displaying total bookings, completed, pending, and failed */}
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                Total Bookings
              </Typography>
              <Typography variant="h4" align="center">
                {totalBookings}
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
                {totalPending}
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
                {totalCompleted}
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
                {totalFailed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different booking statuses */}
      <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons aria-label="Booking Tabs">
        <Tab label="Summary" />
        <Tab label="Pending" />
        <Tab label="Completed" />
        <Tab label="Failed" />
      </Tabs>

      {/* Render table based on selected tab */}
      {value === 0 && renderTable("summary")}
      {value === 1 && renderTable("pending")}
      {value === 2 && renderTable("completed")}
      {value === 3 && renderTable("failed")}
    </Box>
  );
}

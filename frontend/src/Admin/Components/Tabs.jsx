import * as React from "react";
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

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

  const renderTable = (status) => (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings[status].map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.name}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{booking.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", margin: 5 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Booking Management
      </Typography>

      {/* Tabs for different booking statuses */}
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

      {/* Render table based on selected tab */}
      {value === 0 && renderTable("summary")}
      {value === 1 && renderTable("pending")}
      {value === 2 && renderTable("completed")}
      {value === 3 && renderTable("failed")}
    </Box>
  );
}

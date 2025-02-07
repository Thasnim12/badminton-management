import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Layout from "../Global/Layouts"; // Adjust the import path based on your directory structure

const ManageBookings = () => {
  return (
    <Layout>
      <Container>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h4">Manage Bookings</Typography>
        </Box>
        <Typography variant="body1">
          Here you can manage bookings. View booking details, update statuses, and more.
        </Typography>
      </Container>
    </Layout>
  );
};

export default ManageBookings;

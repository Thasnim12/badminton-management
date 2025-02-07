import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Layout from "../Global/Layouts"; // Adjust the import path based on your directory structure

const ManagePayments = () => {
  return (
    <Layout>
      <Container>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h4">Manage Payments</Typography>
        </Box>
        <Typography variant="body1">
          Here you can manage payments. View payment details, track statuses, and more.
        </Typography>
      </Container>
    </Layout>
  );
};

export default ManagePayments;

import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Layout from "../Global/Layouts"; // Adjust the import based on where your Layout component is

const ManageDonations = () => {
  return (
    <Layout>
      <Container>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h4">Manage Donations</Typography>
        </Box>
        <Typography variant="body1">
          Here you can manage the donations. View donation details, track payments, and more.
        </Typography>
      </Container>
    </Layout>
  );
};

export default ManageDonations;


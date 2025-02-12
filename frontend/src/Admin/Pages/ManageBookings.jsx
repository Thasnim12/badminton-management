import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Layout from "../Global/Layouts";
import ScrollableTabsButtonVisible from "../Components/Tabs";

const ManageBookings = () => {
  return (
    <Layout>
      <Container>
        <ScrollableTabsButtonVisible />
      </Container>
    </Layout>
  );
};

export default ManageBookings;

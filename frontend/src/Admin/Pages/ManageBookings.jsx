import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Layout from "../Global/Layouts";
import ScrollableTabsButtonVisible from "../Components/Tabs";
import BreadcrumbNav from "../Global/Breadcrumb";

const ManageBookings = () => {
  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
        <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Bookings", path: "/admin/manage-bookings" },
          ]}
        />
        <ScrollableTabsButtonVisible />
      </Container>
    </Layout>
  );
};

export default ManageBookings;

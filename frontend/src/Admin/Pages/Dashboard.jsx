import React, { useState } from "react";
import {
  CssBaseline,
  Typography,
  Toolbar,
  Container,
  Grid,
  Paper,
  IconButton,
  Badge,
  AppBar,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Chart from "../Components/chart";
import Deposits from "../Components/Deposit";
import Orders from "../Components/Orders";
import Layout from "../Global/Layouts";
import Cards from "../Components/Cards";
import Piechart from "../Components/Piecharts";
import ManageStaffs from "./ManageStaffs";
import { useGetBookingsQuery } from "../../Slices/AdminApi";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenform] = useState(false);

  const { data, isLoading: isLoadingBookings } = useGetBookingsQuery();
  const bookingsData = data?.bookings || [];

  const handleClickOpen = () => {
    setOpenform(true);
  };

  const handleClose = () => {
    setOpenform(false);
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: { xs: 2, sm: 3, md: 5 },
        }}
      >
        <Grid container spacing={3}>
          {/* Cards */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Cards />
              {/* <Button variant="outlined" sx={{ whiteSpace: "nowrap" }} onClick={handleClickOpen}>
                Manage Staff
              </Button> */}
            </Box>
          </Grid>

          {/* Charts Section */}
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  padding: 4,
                  height: 350,
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                <Piechart bookingsData={bookingsData} />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  padding: 4,
                  height: 350,
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                <Chart bookingsData={bookingsData} />
              </Paper>
            </Grid>
          </Grid>

          {/* Orders Table */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, width: "100%", overflowX: "auto" }}>
              <Orders bookingsData={bookingsData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {openForm && (
        <ManageStaffs
          openForm={openForm}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        />
      )}
    </Layout>
  );
}

import React, { useState } from "react";
import {
  CssBaseline, Typography, Toolbar, Container, Grid, Paper,
  IconButton, Badge, AppBar, Box, Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Chart from "../Components/chart";
import Deposits from "../Components/Deposit";
import Orders from "../Components/Orders";
import Layout from "../Global/Layouts";
import Cards from '../Components/Cards'
import Piechart from "../Components/Piecharts";
import ManageStaffs from "./ManageStaffs";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [ openForm,setOpenform ] = useState(false)

  const handleClickOpen = () => {
    setOpenform(true);
  };

  const handleClose = () => {
    setOpenform(false);
  };

  return (
    <Layout>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, margin: 5 }}>
          <Grid container spacing={3}>
            {/* Cards */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Cards />
                <Button variant="contained" sx={{ whiteSpace: "nowrap", backgroundColor: "#2c387e" }}  onClick={handleClickOpen}>
                  Manage Staff
                </Button>
              </Box>
            </Grid>


            {/* Charts (Pie + Graph) */}
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ padding: 4, height: 350, width: "100%", marginRight: 10 }}>
                  <Piechart />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ padding: 4, height: 350, width: "100%" }}>
                  <Chart />
                </Paper>
              </Grid>
            </Grid>

            {/* Orders (Full Width) */}
            <Grid item xs={12}>
              <Paper sx={{ padding: 2, width: "100%" }}>
                <Orders />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {openForm && <ManageStaffs openForm={openForm} handleClickOpen={handleClickOpen} handleClose={handleClose}/>}
    </Layout>
  );

}

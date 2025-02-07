import React from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Layout from "../Global/Layouts";

const barChartData = [
  { month: "Jan", 2019: 30, 2020: 50 },
  { month: "Feb", 2019: 40, 2020: 65 },
  { month: "Mar", 2019: 35, 2020: 70 },
  { month: "Apr", 2019: 55, 2020: 85 },
  { month: "May", 2019: 65, 2020: 95 },
  { month: "Jun", 2019: 50, 2020: 75 },
];

const areaChartData = [
  { month: "Jan", low: 10, high: 40 },
  { month: "Feb", low: 20, high: 60 },
  { month: "Mar", low: 30, high: 80 },
  { month: "Apr", low: 40, high: 90 },
  { month: "May", low: 50, high: 100 },
  { month: "Jun", low: 45, high: 85 },
];

const Dashboard = () => {
  return (
    <Layout>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Admin Dashboard
        </Typography>

        {/* Cards Section */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" color="primary">$628</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Bookings</Typography>
              <Typography variant="h4" color="primary">2434</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Profit</Typography>
              <Typography variant="h4" color="primary">1259</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Donations</Typography>
              <Typography variant="h4" color="primary">8.5</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts & Progress Section */}
        <Grid container spacing={2} sx={{ marginTop: 4 }}>
          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ padding: 3 }}>
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>Result</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barChartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="2019" fill="#FFB74D" />
                      <Bar dataKey="2020" fill="#1976D2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ padding: 3 }}>
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>Growth Trend</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={areaChartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="low" stroke="#FFB74D" fill="#FFECB3" />
                      <Area type="monotone" dataKey="high" stroke="#1976D2" fill="#BBDEFB" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Progress Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 3, textAlign: "center" }}>
              <Typography variant="h6">Progress</Typography>
              <CircularProgress variant="determinate" value={45} size={100} thickness={5} sx={{ marginTop: 2 }} />
              <Typography variant="h4" sx={{ marginTop: 1 }}>45%</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;


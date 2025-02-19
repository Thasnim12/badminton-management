import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import { useGetStaffsQuery } from "../../Slices/AdminApi";

const MembersPage = () => {
  const { data, isLoading, isError } = useGetStaffsQuery();
  const members = data?.staffs;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography align="center">
        Failed to load staff members. Please try again later.
      </Typography>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Team
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {members?.map((member, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: "center", padding: 2, borderRadius: 3 }}>
                <Avatar
                  src={`http://localhost:5000/uploads/${member.staff_image}`}
                  alt={member.name}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "auto",
                    mb: 2,
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />

                <CardContent>
                  <Typography variant="h6">{member.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.designation}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default MembersPage;

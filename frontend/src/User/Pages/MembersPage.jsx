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
import { useGetStaffsForUsersQuery } from "../../Slices/UserApi";

const MembersPage = () => {
  const { data, isLoading, isError } = useGetStaffsForUsersQuery();
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

  // Group members by designation
  const groupedMembers = members?.reduce((acc, member) => {
    acc[member.designation] = acc[member.designation] || [];
    acc[member.designation].push(member);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <Box sx={{ padding: 4, minHeight: "100vh" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Team
        </Typography>

        {Object.entries(groupedMembers).map(([designation, members]) => (
          <Box key={designation} sx={{ marginBottom: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              {designation}
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {members.map((member, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      padding: 2,
                      borderRadius: 3,
                      height: "100%", // Ensure cards take full height within their container
                    }}
                  >
                    <Avatar
                      src={`http://res.cloudinary.com/dj0rho12o/image/upload/${member.staff_image}`}
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
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
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
        ))}
      </Box>
      <Footer />
    </>
  );
};

export default MembersPage;

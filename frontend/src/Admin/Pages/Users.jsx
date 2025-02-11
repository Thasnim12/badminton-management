import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress 
} from "@mui/material";
import Layout from "../Global/Layouts";
import { useGetAllUsersQuery } from "../../Slices/AdminApi";

const Users = () => {
  const { 
    data: users, 
    isLoading, 
    isError, 
    error 
  } = useGetAllUsersQuery();

  const handleStatusChange = (userId, currentStatus) => {
    console.log(`Changing status of user ${userId} to ${currentStatus === "active" ? "blocked" : "active"}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Layout>
        <Container>
          <Typography color="error" variant="h6">
            Error: {error?.data?.message || 'Failed to fetch users'}
          </Typography>
        </Container>
      </Layout>
    );
  }

  // Make sure users exists before rendering
  if (!users) {
    return (
      <Layout>
        <Container>
          <Typography>No users found.</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <Typography variant="h4">Manage Users</Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="user management table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.status === "active" ? "Active" : "Blocked"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={user.status === "active" ? "error" : "success"}
                      onClick={() => handleStatusChange(user.id, user.status)}
                    >
                      {user.status === "active" ? "Block" : "Unblock"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
};

export default Users;

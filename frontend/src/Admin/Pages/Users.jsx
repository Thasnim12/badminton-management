import React from "react";
import { Box, Typography, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Layout from "../Global/Layouts"; // Adjust the import based on where your Layout component is
import { useGetAllUsersQuery } from "../../Slices/AdminApi"; // Make sure the import path is correct

const Users = () => {

  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();


  const handleStatusChange = (userId, currentStatus) => {
    // For simplicity, toggling between 'active' and 'blocked' here.
    // In real app, you'll want to make an API request to update the user status.
    console.log(`Changing status of user ${userId} to ${currentStatus === "active" ? "blocked" : "active"}`);
  };

  // Show loading or error message
  if (isLoading) {
    return <Typography>Loading users...</Typography>;
  }

  if (isError) {
    return <Typography>Error fetching users.</Typography>;
  }

  return (
    <Layout>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <Typography variant="h4">Manage Users</Typography>
        </Box>

        {/* Table for managing users */}
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

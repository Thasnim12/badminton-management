import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import Layout from "../Global/Layouts";
import { useGetAllUsersQuery, useManageusersMutation } from "../../Slices/AdminApi";
import { Snackbar, Alert } from "@mui/material";

// Styled Table Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  fontWeight: "bold",
  padding: "10px",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Users = () => {

  const { data, isLoading, isError, refetch } = useGetAllUsersQuery();
  const [manageUsers] = useManageusersMutation();
  const users = data?.users || [];

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleStatusChange = async (userId) => {
    try {
      const response = await manageUsers(userId).unwrap();
      setSnackbarMessage(response.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refetch();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Manage Users
        </Typography>
        {!isLoading && !isError && users.length > 0 && (
          <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
            <Table aria-label="User Management Table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <StyledTableRow key={user._id}>
                    <StyledTableCell>{user.name}</StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>{user.phoneno}</StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="contained"
                        color={user.is_blocked === true ? "error" : "success"}
                        onClick={() => handleStatusChange(user._id)}
                      >
                        {user.is_blocked === true ? "unblock" : "block"}
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Show Message if No Users Found */}
        {!isLoading && !isError && users.length === 0 && (
          <Typography align="center">No users found.</Typography>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Closes after 3 seconds
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Adjust position
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity} // "success" or "error"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Users;

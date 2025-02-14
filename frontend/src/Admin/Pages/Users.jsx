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
  Snackbar,
  Alert,
  Box,
  Pagination,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import Layout from "../Global/Layouts";
import {
  useGetAllUsersQuery,
  useManageusersMutation,
} from "../../Slices/AdminApi";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
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

  // Pagination states
  const [page, setPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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

  // Calculate total, active, and blocked users
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => !user.is_blocked).length;
  const blockedUsers = users.filter((user) => user.is_blocked).length;

  return (
    <Layout>
      <Container sx={{marginTop: "25px"}}>
        {/* Cards for User Counts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <GroupIcon sx={{ mr: 1 }} />
                  Total Users
                </Typography>
                <Typography variant="h4">{totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  Active Users
                </Typography>
                <Typography variant="h4">{activeUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <BlockIcon sx={{ mr: 1 }} />
                  Blocked Users
                </Typography>
                <Typography variant="h4">{blockedUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {!isLoading && !isError && users.length > 0 && (
          <>
            <TableContainer
              component={Paper}
              sx={{ width: "100%", overflowX: "auto" }}
            >
              <Table aria-label="User Management Table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">Phone</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <StyledTableRow key={user._id}>
                      <StyledTableCell align="center">
                        {user.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {user.email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {user.phoneno}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="outlined"
                          color={user.is_blocked ? "error" : "success"}
                          onClick={() => handleStatusChange(user._id)}
                        >
                          {user.is_blocked ? "Unblock" : "Block"}
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}

        {/* Show Message if No Users Found */}
        {!isLoading && !isError && users.length === 0 && (
          <Typography align="center">No users found.</Typography>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Users;

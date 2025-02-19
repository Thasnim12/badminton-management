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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import Layout from "../Global/Layouts";
import BreadcrumbNav from "../Global/Breadcrumb";
import {
  useGetAllUsersQuery,
  useManageusersMutation,
  useAddUserMutation,
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
  const [addUsers] = useAddUserMutation();
  const users = data?.users || [];

  const [page, setPage] = useState(1);
  const usersPerPage = 7;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStatusChange = async (user) => {
    setUserToBlock(user);
    setConfirmOpen(true);
  };

  const handleConfirmBlockUnblock = async () => {
    try {
      const response = await manageUsers(userToBlock._id).unwrap();
  
      setSnackbar({
        open: true,
        message: response.message || "User status updated successfully!",
        type: "success",
      });
  
      setConfirmOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating user status:", error);
  
      setSnackbar({
        open: true,
        message: "Failed to update user status. Please try again.",
        type: "error",
      });
  
      setConfirmOpen(false);
    }
  };
  


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSnackbar({ ...snackbar, open: false });
    if (!formData.name || !formData.email || !formData.phoneno) {
      setSnackbar({
        open: true,
        message: "Please fill in all the fields.",
        type: "error",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    try {
      const response = await addUsers(formData);

      if (response.error) {
        setSnackbar({
          open: true,
          message: response.error.data.message || "Error occurred",
          type: "error",
        });
        return;
      }

      setSnackbar({
        open: true,
        message: response.message || "User added successfully!",
        type: "success",
      });
      setOpen(false);
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error connecting to server",
        type: "error",
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => !user.is_blocked).length;
  const blockedUsers = users.filter((user) => user.is_blocked).length;

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
        <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Users", path: "/admin/users" },
          ]}
        />
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
          <Grid item xs={16} sm={4}>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{ backgroundColor: "#2c387e" }}
            >
              Add User
            </Button>

            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Add New User</DialogTitle>
              <DialogContent>
                {alert.message && (
                  <Alert severity={alert.type} sx={{ marginBottom: "16px" }}>
                    {alert.message}
                  </Alert>
                )}
                <TextField
                  margin="dense"
                  label="Name"
                  name="name"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  name="email"
                  fullWidth
                  variant="outlined"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Number"
                  name="phoneno"
                  fullWidth
                  variant="outlined"
                  type="tel"
                  value={formData.phoneno}
                  onChange={handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpen(false)}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="outlined"
                  color="success"
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
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
                          onClick={() => handleStatusChange(user)}
                        >
                          {user.is_blocked ? "Unblock" : "Block"}
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>
                {userToBlock?.is_blocked ? "Unblock User" : "Block User"}
              </DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to{" "}
                  {userToBlock?.is_blocked ? "unblock" : "block"} this user?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setConfirmOpen(false)}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBlockUnblock} // Use the confirm handler
                  color="primary"
                  variant="outlined"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

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

        {!isLoading && !isError && users.length === 0 && (
          <Typography align="center">No users found.</Typography>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Users;

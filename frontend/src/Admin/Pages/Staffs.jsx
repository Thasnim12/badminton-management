import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  useGetStaffsQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "../../Slices/AdminApi";
import VisibilityIcon from "@mui/icons-material/Visibility"; // View Icon
import EditIcon from "@mui/icons-material/Edit"; // Edit Icon
import DeleteIcon from "@mui/icons-material/Delete"; // Delete Icon
import Layout from "../Global/Layouts";

const ManageStaffs = () => {
  const { data, error, isLoading, refetch } = useGetStaffsQuery(); // Fetch staff data with refetch capability
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [mode, setMode] = useState("view");

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching staff data</Typography>;

  // Open the view modal
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setMode("view");
    setOpenModal(true);
  };

  // Open the confirmation dialog before deleting
  const handleDeleteStaff = (staff) => {
    setSelectedStaff(staff);
    setOpenConfirmDialog(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (selectedStaff) {
      try {
        await deleteStaff(selectedStaff._id).unwrap();
        setOpenConfirmDialog(false);
        setSelectedStaff(null);
        refetch(); // Refetch data after deletion
      } catch (err) {
        console.error("Error deleting staff:", err);
      }
    }
  };

  // Open the edit modal
  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setMode("edit");
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStaff(null);
    setMode("view");
  };

  // Handle form submission for updating staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStaff) {
      try {
        await updateStaff(selectedStaff).unwrap();
        handleCloseModal();
        refetch(); // Refetch data after update
      } catch (err) {
        console.error("Error updating staff:", err);
      }
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Manage Staffs
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="staff table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Staff Name</TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>Email Address</TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>Phone Number</TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>Designation</TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>Employee ID</TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>Joining Date</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.staffs?.map((staff) => (
                <TableRow key={staff._id}>
                  <TableCell component="th" scope="row">{staff.name}</TableCell>
                  <TableCell align="left">{staff.email}</TableCell>
                  <TableCell align="left">{staff.phoneno}</TableCell>
                  <TableCell align="left">{staff.designation}</TableCell>
                  <TableCell align="left">{staff.employee_id}</TableCell>
                  <TableCell align="left">{new Date(staff.joining_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" sx={{ marginRight: 1 }} onClick={() => handleViewStaff(staff)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" sx={{ marginRight: 1 }} onClick={() => handleEditStaff(staff)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteStaff(staff)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for viewing/editing staff */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" mb={2}>{mode === "edit" ? "Edit Staff" : "View Staff"}</Typography>
            {selectedStaff && (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  value={selectedStaff.name}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, name: e.target.value })}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: mode === "view" }}
                />
                <TextField
                  label="Email"
                  value={selectedStaff.email}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, email: e.target.value })}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: mode === "view" }}
                />
                <TextField
                  label="Phone No."
                  value={selectedStaff.phoneno}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, phoneno: e.target.value })}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: mode === "view" }}
                />
                <TextField
                  label="Designation"
                  value={selectedStaff.designation}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, designation: e.target.value })}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: mode === "view" }}
                />
                {mode === "edit" && (
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Staff"}
                  </Button>
                )}
              </form>
            )}
          </Box>
        </Modal>

        {/* Confirmation Dialog for Deletion */}
        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this staff member?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">Cancel</Button>
            <Button onClick={confirmDelete} color="error" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ManageStaffs;

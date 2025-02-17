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
  Pagination,
  Card,
} from "@mui/material";
import {
  useGetStaffsQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "../../Slices/AdminApi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../Global/Layouts";
import BreadcrumbNav from "../Global/Breadcrumb";
import ManageStaffs from "./ManageStaffs";

const Staffs = () => {
  const { data, error, isLoading, refetch } = useGetStaffsQuery();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [mode, setMode] = useState("view");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [openForm, setOpenform] = useState(false);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching staff data</Typography>;

  const paginatedStaffs = data?.staffs?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleClickOpen = () => {
    setOpenform(true);
  };

  const handleClose = () => {
    setOpenform(false);
  };

  const handlePageChange = (event, value) => setPage(value);

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setMode("view");
    setOpenModal(true);
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setMode("edit");
    setOpenModal(true);
  };

  const handleDeleteStaff = (staff) => {
    setSelectedStaff(staff);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedStaff) {
      try {
        await deleteStaff(selectedStaff._id).unwrap();
        setOpenConfirmDialog(false);
        setSelectedStaff(null);
        refetch();
      } catch (err) {
        console.error("Error deleting staff:", err);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStaff(null);
    setMode("view");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStaff) {
      try {
        await updateStaff(selectedStaff).unwrap();
        handleCloseModal();
        refetch();
      } catch (err) {
        console.error("Error updating staff:", err);
      }
    }
  };

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }} maxWidth="lg">
        <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Staffs", path: "/admin/manage-staffs" },
          ]}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "25px",
          }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2c387e", color: "white"}}
            onClick={handleClickOpen}
          >
           Add Staff
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 ,  marginTop: "25px",}}
        >
          <Table sx={{ minWidth: 650 }} aria-label="staff table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 16 }}>Staff Name</TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Email Address
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Phone Number
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Designation
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Employee ID
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Joining Date
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStaffs?.map((staff) => (
                <TableRow key={staff._id}>
                  <TableCell component="th" scope="row">
                    {staff.name}
                  </TableCell>
                  <TableCell align="center">{staff.email}</TableCell>
                  <TableCell align="center">{staff.phoneno}</TableCell>
                  <TableCell align="center">{staff.designation}</TableCell>
                  <TableCell align="center">{staff.employee_id}</TableCell>
                  <TableCell align="center">
                    {new Date(staff.joining_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleViewStaff(staff)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleEditStaff(staff)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteStaff(staff)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(data?.staffs?.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

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
            <Typography variant="h6" mb={2}>
              {mode === "edit" ? "Edit Staff" : "View Staff"}
            </Typography>
            {selectedStaff && (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  value={selectedStaff.name}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, name: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: mode === "view" }}
                />
                <TextField
                  label="Email"
                  value={selectedStaff.email}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      email: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: mode === "view" }}
                />
                <TextField
                  label="Phone"
                  value={selectedStaff.phoneno}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      phoneno: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: mode === "view" }}
                />
                <TextField
                  label="Designation"
                  value={selectedStaff.designation}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      designation: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: mode === "view" }}
                />
                {mode === "edit" && (
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Staff"}
                  </Button>
                )}
              </form>
            )}
          </Box>
        </Modal>

        {/* Confirmation Dialog for Deletion */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this staff member?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="outlined"  disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      {openForm && (
        <ManageStaffs
          openForm={openForm}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        />
      )}
    </Layout>
  );
};

export default Staffs;

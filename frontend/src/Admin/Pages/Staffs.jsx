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
  Snackbar,
  Alert,
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
import EditStaffs from "../Components/EditStaff";

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
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  if (isLoading) return <Typography>Loading...</Typography>;

  const paginatedStaffs = data?.staffs?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setSelectedImage("");
  };

  const handleClickOpen = () => {
    setOpenform(true);
  };

  const handleClose = () => {
    setOpenform(false);
  };

  const handleOpenEdit = (staff) => {
    setSelectedStaff(staff);
    setOpenEditForm(true);
  };

  const handleCloseEdit = () => {
    setOpenEditForm(false);
    setSelectedStaff(null);
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

        setSnackbar({
          open: true,
          message: "Staff member deleted successfully!",
          type: "success",
        });

        setOpenConfirmDialog(false);
        setSelectedStaff(null);
        refetch();
      } catch (err) {
        console.error("Error deleting staff:", err);

        setSnackbar({
          open: true,
          message: "Failed to delete staff. Please try again.",
          type: "error",
        });
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
            sx={{ backgroundColor: "#2c387e", color: "white" }}
            onClick={handleClickOpen}
          >
            Add Staff
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2, marginTop: "25px" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="staff table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Staff Image
                </TableCell>
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
              {paginatedStaffs && paginatedStaffs.length > 0 ? (
                paginatedStaffs.map((staff) => (
                  <TableRow key={staff._id}>
                    <TableCell align="center">
                      {staff.staff_image ? (
                        <img
                          src={`http://localhost:5000/uploads/${staff.staff_image}`}
                          alt={staff.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleImageClick(
                              `http://localhost:5000/uploads/${staff.staff_image}`
                            )
                          }
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
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
                        onClick={() => handleOpenEdit(staff)}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
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
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
              textAlign: "center",
            }}
          >
            {/* Profile Image Display */}
            <Box sx={{ mb: 2 }}>
              {selectedStaff && selectedStaff.staff_image && (
                <Box sx={{ position: "relative" }}>
                  <img
                    src={`http://localhost:5000/uploads/${selectedStaff.staff_image}`}
                    alt="Staff"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: 10,
                    }}
                  />
                </Box>
              )}
            </Box>

            <Typography variant="h6" mb={2}>
              {mode === "edit" ? "Edit Staff" : "View Staff"}
            </Typography>
            {selectedStaff && (
              <form onSubmit={() => {}}>
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

                {/* Submit Button for Editing */}
                {mode === "edit" && (
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
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

        {/* staff Image Card */}
        <Dialog open={openImage} onClose={handleCloseImage} maxWidth="md">
          <DialogTitle>Staff Image</DialogTitle>
          <DialogContent>
            <img
              src={selectedImage}
              style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          </DialogContent>
        </Dialog>

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
            <Button
              onClick={() => setOpenConfirmDialog(false)}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="outlined"
              disabled={isDeleting}
            >
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
          setSnackbar={setSnackbar}
        />
      )}

      {openEditForm && selectedStaff && (
        <EditStaffs
          openForm={openEditForm}
          handleClose={handleCloseEdit}
          editData={selectedStaff}
          setSnackbar={setSnackbar}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Staffs;

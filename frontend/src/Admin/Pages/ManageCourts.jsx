import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Paper,
  TableCell,
  Grid,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Table,
  Container,
} from "@mui/material";
import BreadcrumbNav from "../Global/Breadcrumb";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import BlockIcon from "@mui/icons-material/Block";
import { styled } from "@mui/material/styles";
import Layout from "../Global/Layouts";
import FullScreenDialog from "../Components/ViewCourt";
import {
  useAddcourtsMutation,
  useGetAllcourtsQuery,
  useEditCourtStatusMutation,
  useDeleteCourtMutation,
} from "../../Slices/AdminApi";

const SlotManagement = () => {
  const [open, setOpen] = useState(false);
  const [courtName, setCourtName] = useState("");
  const [courtImage, setCourtImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedcourt, SetSelectedCourt] = useState("");
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // for the status change confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [addcourt] = useAddcourtsMutation();
  const { data: courts, refetch } = useGetAllcourtsQuery();
  const [editCourtStatus] = useEditCourtStatusMutation(); // Mutation for updating the court status
  const [deleteCourt] = useDeleteCourtMutation();

  const handleDeleteCourt = async (court) => {
    SetSelectedCourt(court);
    setDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedcourt) {
      try {
        await deleteCourt({ courtId: selectedcourt._id }).unwrap();
        refetch();
        setDeleteConfirmation(false);
      } catch (error) {
        console.error("Failed to delete court:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = (court) => {
    SetSelectedCourt(court);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmationDialogClose = () => {
    setConfirmationDialogOpen(false);
  };

  const handleStatusChange = async (court) => {
    SetSelectedCourt(court);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedcourt) {
      try {
        await editCourtStatus({ courtId: selectedcourt._id }).unwrap();
        refetch();
        setConfirmationDialogOpen(false);
      } catch (error) {
        console.error("Failed to update court status:", error);
      }
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleAddcourt = async () => {
    if (!courtName || !courtImage) {
      setErrorMessage("Please enter a court name and select an image.");
      return;
    }

    setErrorMessage("");

    const formData = new FormData();
    formData.append("court_name", courtName);
    formData.append("court_image", courtImage);

    try {
      const response = await addcourt(formData).unwrap();
      console.log("Court added:", response);
      setCourtImage("");
      setCourtName("");
      handleClose();
      refetch();
    } catch (error) {
      console.error("Failed to add court:", error);
      setErrorMessage("Failed to add court. Please try again.");
    }
  };

  const activeCourts =
    courts?.courts?.filter((court) => court.isActive).length || 0;
  const inactiveCourts =
    courts?.courts?.filter((court) => !court.isActive).length || 0;
  const totalCourts = courts?.courts?.length || 0;

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
        <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Courts", path: "/admin/manage-courts" },
          ]}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Grid container spacing={3} sx={{ flexGrow: 1 }}>
            <Grid item xs={16} sm={4}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <GroupIcon sx={{ mr: 1 }} />
                    Total Courts
                  </Typography>
                  <Typography variant="h4">{totalCourts}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={16} sm={4}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    Active Courts
                  </Typography>
                  <Typography variant="h4">{activeCourts}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={16} sm={4}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <BlockIcon sx={{ mr: 1 }} />
                    Inactive Courts
                  </Typography>
                  <Typography variant="h4">{inactiveCourts}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={16} sm={4}>
              <Button
                variant="contained"
                onClick={handleClickOpen}
                sx={{ backgroundColor: "#2c387e" }}
              >
                Add court
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            Add your court name and image to manage your courts and time slots!
          </DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2}>
              <TextField
                label="Court name"
                variant="filled"
                size="small"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                error={!courtName && errorMessage}
              />
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload files
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    console.log("Selected file:", file);
                    setCourtImage(file);
                  }}
                  accept="image/*"
                />
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleAddcourt}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <TableContainer
            component={Paper}
            sx={{ marginTop: 4, maxWidth: "80%" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Court Name</TableCell>
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="center">Active</TableCell>
                  <TableCell align="center">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courts?.courts?.map((court) => (
                  <TableRow key={court._id}>
                    <TableCell align="center">{court.court_name}</TableCell>
                    <TableCell align="center">
                      {court.court_image ? (
                        <img
                          src={`http://localhost:5000/uploads/${court.court_image}`}
                          alt={court.court_name}
                          style={{ width: 80, height: 50, objectFit: "cover" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color={court.isActive ? "success" : "error"}
                        onClick={() => handleStatusChange(court)} // Open the status change confirmation dialog
                      >
                        {court.isActive ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleOpenDialog(court)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCourt(court)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Confirmation Dialog for status change */}
        <Dialog
          open={confirmationDialogOpen}
          onClose={handleConfirmationDialogClose}
        >
          <DialogTitle>Change Court Status</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to{" "}
              {selectedcourt?.isActive ? "deactivate" : "activate"} this court?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmationDialogClose} color="error"  variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleConfirmStatusChange} variant="outlined">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for Delete */}
        <Dialog open={deleteConfirmation} onClose={handleCancelDelete}>
          <DialogTitle>Delete Court</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this court? This action cannot be
            undone.
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelDelete}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="outlined"
              color="error"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {selectedcourt && (
          <FullScreenDialog
            dialogOpen={dialogOpen}
            handleCloseDialog={handleCloseDialog}
            court={selectedcourt}
          />
        )}
      </Container>
    </Layout>
  );
};

export default SlotManagement;

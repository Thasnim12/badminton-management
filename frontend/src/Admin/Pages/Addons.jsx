import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  IconButton,
  Typography,
  DialogActions,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import Layout from "../Global/Layouts";
import Addaddons from "../Components/Addaddons";
import EditAddons from "../Components/Editaddons";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetAlladdonsQuery,
  useDeleteAddonMutation,
} from "../../Slices/AdminApi"; // RTK Query hook
import BreadcrumbNav from "../Global/Breadcrumb";

const Addons = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1); // Default to page 1
  const [rowsPerPage] = useState(7); // 7 items per page

  const { data, error, isLoading, refetch } = useGetAlladdonsQuery();
  const addons = data?.addons || [];
  const totalAddons = addons ? addons.length : 0;
  const rentedAddons = addons
    ? addons.filter((addon) => addon.item_type.includes("For Rent")).length
    : 0;
  const soldOutAddons = addons
    ? addons.filter((addon) => addon.item_type.includes("For Sale")).length
    : 0;

  const [deleteAddon] = useDeleteAddonMutation();
  const [open, setOpen] = useState(false);

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleOpenDialog = (addon) => {
    setSelectedAddon(addon);
    setOpen(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseDelete = () => {
    setOpen(false);
    setSelectedAddon(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedAddon) {
      try {
        await deleteAddon(selectedAddon._id).unwrap();
        refetch();
        console.log("Addon deleted successfully");
        setSuccessMessage("Addon deleted successfully!");
      } catch (error) {
        console.error("Failed to delete addon:", error);
        setErrorMessage("Failed to delete addon. Please try again.");
      }
    }
    handleCloseDelete();
  };

  const [openImage, setOpenImage] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);

  const handleOpenEdit = (addon) => {
    setSelectedAddon(addon);
    setOpenEditForm(true);
  };

  const handleCloseEdit = () => {
    setOpenEditForm(false);
    setSelectedAddon(null);
  };

  const handleClickOpen = () => setOpenForm(true);
  const handleClose = () => setOpenForm(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setSelectedImage("");
  };

  // Pagination logic
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = page * rowsPerPage;
  const paginatedAddons = addons.slice(startIndex, endIndex);

  return (
    <>
      <Layout sx={{ marginTop: "25px" }}>
        <Container sx={{ marginTop: "25px" }}>
          <BreadcrumbNav
            links={[
              { label: "Dashboard", path: "/admin" },
              { label: "Add ons", path: "/admin/manage-addons" },
            ]}
          />
          <Box sx={{ marginTop: "25px" }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={3}>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <InventoryOutlinedIcon />
                      Total
                    </Typography>
                    <Typography variant="h4">{totalAddons}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={3}>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <HourglassEmptyIcon sx={{ mr: 1 }} />
                      For Rent
                    </Typography>
                    <Typography variant="h4">{rentedAddons}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={3}>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircleIcon sx={{ mr: 1 }} />
                      For Sales
                    </Typography>
                    <Typography variant="h4">{soldOutAddons}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: "25px",
              }}
            >
              <Button
                variant="outlined"
                sx={{ backgroundColor: "#2c387e", color: "white" }}
                onClick={handleClickOpen}
              >
                Manage Addons
              </Button>
            </Box>
          </Grid>

          {/* Display loading or error messages */}
          {isLoading ? (
            <p>Loading add-ons...</p>
          ) : error ? (
            <p>Error fetching add-ons</p>
          ) : (
            <TableContainer sx={{ marginTop: "25px" }} component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="addons table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Image</TableCell>
                    <TableCell align="center">Item Name</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Item Type</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAddons.map((addon) => (
                    <TableRow key={addon._id}>
                      <TableCell align="center">
                        <img
                          src={`https://res.cloudinary.com/dj0rho12o/image/upload/${addon.item_image}`}
                          alt={addon.item_name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleImageClick(
                              `https://res.cloudinary.com/dj0rho12o/image/upload/${addon.item_image}`
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="center">{addon.item_name}</TableCell>
                      <TableCell align="center">{addon.quantity}</TableCell>
                      <TableCell align="center">{addon.price}</TableCell>
                      <TableCell align="center">
                        {addon.item_type.join(", ")}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          sx={{ marginRight: 1 }}
                          onClick={() => handleOpenEdit(addon)}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          key={addon._id}
                          color="error"
                          onClick={() => handleOpenDialog(addon)}
                        >
                          <DeleteIcon />
                        </IconButton>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={open} onClose={handleCloseDelete}>
                          <DialogTitle>
                            Are you sure you want to delete this addon?
                          </DialogTitle>
                          <DialogActions>
                            <Button
                              onClick={handleCloseDelete}
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
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination Component */}
          <Pagination
            count={Math.ceil(addons.length / rowsPerPage)} // Adjust based on the total items
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
          />
        </Container>

        <Dialog open={openImage} onClose={handleCloseImage} maxWidth="md">
          <DialogTitle>Addon Image</DialogTitle>
          <DialogContent>
            <img
              src={selectedImage}
              alt="Addon"
              style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          </DialogContent>
        </Dialog>

        {openForm && (
          <Addaddons
            openForm={openForm}
            handleClose={handleClose}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {openEditForm && selectedAddon && (
          <EditAddons
            openForm={openEditForm}
            handleClose={handleCloseEdit}
            editData={selectedAddon}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {/* Success Alert in Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Layout>
    </>
  );
};

export default Addons;

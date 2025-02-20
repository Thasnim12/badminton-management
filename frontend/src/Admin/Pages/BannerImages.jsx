import { useState } from "react";
import Layout from "../Global/Layouts";
import {
  Box,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  DialogTitle,
  Container,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import { Snackbar, Alert } from "@mui/material";
import {
  useAddBannerMutation,
  useGetAllBannersQuery,
  useLazyViewBannerQuery,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "../../Slices/AdminApi";
import AddBanner from "../Components/Addbanner";
import BreadcrumbNav from "../Global/Breadcrumb";

const BannerImages = () => {
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "error" or "success"
  });

  const [banner, setBanner] = useState({
    title: "",
    imageUrl: [],
    order: [],
    removedImages: [],
    newImages: [],
  });

  const [openConfirm, setOpenConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  const [addBanner] = useAddBannerMutation();
  const { data, refetch } = useGetAllBannersQuery();
  const [fetchBanner] = useLazyViewBannerQuery();
  const [deleteBanner] = useDeleteBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    if (isEditing) {
      setBanner((prev) => ({
        ...prev,
        newImages: [...prev.newImages, ...files],
        order: [
          ...prev.order,
          ...files.map((_, i) => prev.order.length + i + 1),
        ],
      }));
    }
  };

  const handleOpenConfirm = (bannerId) => {
    setBannerToDelete(bannerId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setBannerToDelete(null);
  };

  const handleRemoveNewImage = (index) => {
    setBanner((prev) => {
      const updatedNewImages = [...prev.newImages];
      updatedNewImages.splice(index, 1);
      const updatedOrder = updatedNewImages.map((_, i) => i + 1);
      return {
        ...prev,
        newImages: updatedNewImages,
        order: updatedOrder,
      };
    });
  };

  const handleRemoveExistingImage = (imageUrl, index) => {
    setBanner((prev) => {
      const updatedImages = [...prev.imageUrl];
      updatedImages.splice(index, 1);
      const updatedOrder = updatedImages.map((_, i) => i + 1);
      return {
        ...prev,
        imageUrl: updatedImages,
        removedImages: [...prev.removedImages, imageUrl],
        order: updatedOrder,
      };
    });
  };

  const handleViewBanner = async (bannerId) => {
    setLoading(true);
    try {
      const response = await fetchBanner(bannerId).unwrap();
      console.log("Banner fetch response:", response);

      setBanner({
        _id: response.banner._id,
        title: response.banner.title,
        imageUrl: response.banner.imageUrl || [],
        order: response.banner.order || [],
        removedImages: [],
        newImages: [],
      });

      setOpenView(true);
    } catch (error) {
      console.error("Error fetching banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditBanner = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", banner.title);
    formDataToSend.append("order", JSON.stringify(banner.order));

    if (banner.removedImages.length > 0) {
      formDataToSend.append(
        "removedImages",
        JSON.stringify(banner.removedImages)
      );
    }

    banner.newImages.forEach((file) =>
      formDataToSend.append("banner_image", file)
    );

    try {
      await updateBanner({
        bannerId: banner._id,
        formData: formDataToSend,
      }).unwrap();

      setSnackbar({
        open: true,
        message: "Banner updated successfully!",
        severity: "success",
      });

      setIsEditing(false);
      setOpenView(false);
      refetch();
    } catch (error) {
      console.error("Error updating banner:", error);

      setSnackbar({
        open: true,
        message: "Failed to update banner. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteBanner(bannerToDelete).unwrap();
      refetch();
      setSnackbar({
        open: true,
        message: "Banner deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting banner:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete banner. Please try again.",
        type: "error",
      });
    } finally {
      handleCloseConfirm();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
        <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Banner Images", path: "/admin/enquiry" },
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
            Add Banner
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 1300, margin: "auto" }}
        >
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.banner?.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell>{banner.order.join(", ")}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {banner.imageUrl.map((img, index) => (
                        <img
                          key={index}
                          src={`https://res.cloudinary.com/dj0rho12o/image/upload/${img}`}
                          alt={`Banner ${index + 1}`}
                          style={{
                            width: 80,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 5,
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewBanner(banner._id)}
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenConfirm(banner._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={openView}
          onClose={() => setOpenView(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? "Edit Banner" : banner?.title || "Banner Details"}
          </DialogTitle>
          <DialogContent>
            {isEditing && (
              <TextField
                fullWidth
                label="Title"
                value={banner.title}
                onChange={(e) =>
                  setBanner((prev) => ({ ...prev, title: e.target.value }))
                }
                margin="normal"
              />
            )}
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              {banner?.imageUrl?.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={`https://res.cloudinary.com/dj0rho12o/image/upload/${image}`}
                      alt={`Banner ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    {isEditing && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          backgroundColor: "white",
                        }}
                        onClick={() => handleRemoveExistingImage(image, index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
              {isEditing &&
                banner.newImages.map((file, index) => (
                  <Grid item xs={6} sm={4} md={3} key={`new-${index}`}>
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New Banner ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          backgroundColor: "white",
                        }}
                        onClick={() => handleRemoveNewImage(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Files
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Button>
                <Button
                  onClick={handleEditBanner}
                  variant="outlined"
                  color="success"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => setOpenView(false)}
                  variant="outlined"
                  color="error"
                >
                  Close
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Container>

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this banner?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {open && (
        <AddBanner
          open={open}
          handleClose={handleClose}
          setSnackbar={setSnackbar}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000} // 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar}  severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default BannerImages;

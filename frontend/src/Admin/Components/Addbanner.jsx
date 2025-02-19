import { useState } from "react";
import {
  DialogContent,
  Dialog,
  TextField,
  DialogTitle,
  Grid,
  Button,
  Box,
  DialogActions,
  Typography,
} from "@mui/material";
import { useAddBannerMutation } from "../../Slices/AdminApi";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useGetAllBannersQuery } from "../../Slices/AdminApi";
import { message } from "antd";

const AddBanner = ({ open, handleClose, setSnackbar }) => {
  const { data, refetch } = useGetAllBannersQuery();
  const [addBanner] = useAddBannerMutation();
  const [formData, setFormData] = useState({
    title: "",
    banner_image: [],
    order: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      banner_image: [...prevFormData.banner_image, ...files],
      order: [
        ...prevFormData.order,
        ...files.map((_, i) => prevFormData.order.length + i + 1),
      ], // Auto-fill order
    }));
  };

  const handleOrderChange = (index, value) => {
    const updatedOrder = [...formData.order];
    updatedOrder[index] = Number(value);
    setFormData((prev) => ({ ...prev, order: updatedOrder }));
  };

  const handleBanner = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("order", JSON.stringify(formData.order));

      formData.banner_image.forEach((file) => {
        formDataToSend.append("banner_image", file);
      });

      await addBanner(formDataToSend).unwrap();

      setSnackbar({
        open: true,
        message: "Banner added successfully!",
        type: "success",
      });
      refetch();
      handleClose();
    } catch (error) {
      console.error("Error adding banner:", error);
      setSnackbar({
        open: true,
        message: error?.data?.message,
        type: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleBanner,
        },
      }}
    >
      <DialogTitle>Add Banner Images</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={formData.title}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <Grid item xs={12}>
          <input
            accept="image/*"
            type="file"
            id="file-upload"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              component="span"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ backgroundColor: "#2c387e", color: "white", mt: 2 }}
            >
              Upload banners
            </Button>
          </label>
          {formData.banner_image.map((file, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
            >
              <Typography variant="body2">{file.name}</Typography>
              <TextField
                type="number"
                label="Order"
                variant="standard"
                value={formData.order[index] || ""}
                onChange={(e) => handleOrderChange(index, e.target.value)}
                sx={{ width: "80px" }}
              />
            </Box>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="success" type="submit">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBanner;

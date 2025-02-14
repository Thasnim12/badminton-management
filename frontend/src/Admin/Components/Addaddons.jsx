import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress,
  Box,
  Snackbar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAddaddonsMutation } from "../../Slices/AdminApi";

const Addaddons = ({ openForm, handleClose }) => {
  const [addons, { isLoading }] = useAddaddonsMutation();
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    price: "",
    item_type: [],
    item_image: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      item_type: checked
        ? [...prev.item_type, name]
        : prev.item_type.filter((type) => type !== name),
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, item_image: file });
    }
  };

  const handleAddons = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("item_name", formData.item_name);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("item_image", formData.item_image);
      formData.item_type.forEach((type) => formDataToSend.append("item_type[]", type));

      const response = await addons(formDataToSend).unwrap();
      console.log("Addon Added Successfully:", response);

      setSuccessMessage("Addon added successfully!");
      handleClose();
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong!");
    }
  };

  return (
    <Dialog
      open={openForm}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleAddons,
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Add New Addon
      </DialogTitle>

      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {/* Item Name */}
            <Grid item xs={12}>
              <TextField
                name="item_name"
                label="Item Name"
                variant="outlined"
                fullWidth
                required
                value={formData.item_name}
                onChange={handleChange}
              />
            </Grid>

            {/* Quantity */}
            <Grid item xs={12}>
              <TextField
                name="quantity"
                label="Quantity"
                variant="outlined"
                fullWidth
                required
                value={formData.quantity}
                onChange={handleChange}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12}>
              <TextField
                name="price"
                label="Price"
                variant="outlined"
                fullWidth
                required
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>

            {/* Checkboxes for Item Type */}
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="For Sale"
                      checked={formData.item_type.includes("For Sale")}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="For Sale"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="For Rent"
                      checked={formData.item_type.includes("For Rent")}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="For Rent"
                />
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
                <input
                  accept="image/*"
                  type="file"
                  id="file-upload"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ backgroundColor: "#2c387e", color: "white" }}
                  >
                    Upload Image
                  </Button>
                </label>
                {formData.item_image && (
                  <Typography variant="body2" color="textSecondary">
                    {formData.item_image.name}
                  </Typography>
                )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />

      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button onClick={handleClose} color="secondary" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" sx={{ backgroundColor: "#2c387e", color: "white" }} disabled={isLoading}>
          {isLoading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={20} sx={{ color: "white", marginRight: 1 }} />
              Adding...
            </Box>
          ) : (
            "Add Addon"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Addaddons;

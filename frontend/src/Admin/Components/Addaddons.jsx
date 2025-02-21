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
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  useAddaddonsMutation,
  useGetAlladdonsQuery,
} from "../../Slices/AdminApi";

const Addaddons = ({ openForm, handleClose, setSuccessMessage, setErrorMessage }) => {
  const [addons, { isLoading }] = useAddaddonsMutation();
  const { data, refetch } = useGetAlladdonsQuery();
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    price: "",
    item_type: [],
    item_image: null,
  });

  // const [successMessage, setSuccessMessage] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    });
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
      formData.item_type.forEach((type) =>
        formDataToSend.append("item_type[]", type)
      );

      const response = await addons(formDataToSend).unwrap();
      console.log("Addon Added Successfully:", response);

      setSuccessMessage("Addon added successfully!");
      refetch();
      handleClose();
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong!";
      setErrorMessage(errorMessage);
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
                value={formData.item_name}
                onChange={handleChange}
              />
            </Grid>

            {/* Quantity */}
            <Grid item xs={12}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12}>
              <TextField
                name="price"
                label="Single Unit Price"
                variant="outlined"
                fullWidth
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>

            {formData.quantity && formData.price && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Price: ₹{(formData.quantity * formData.price).toFixed(2)}
                </Typography>
              </Grid>
            )}

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

      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="error"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          sx={{ backgroundColor: "#2c387e", color: "white" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress
                size={20}
                sx={{ color: "white", marginRight: 1 }}
              />
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

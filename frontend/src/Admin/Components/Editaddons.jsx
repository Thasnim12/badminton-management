import React, { useState, useEffect } from "react";
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
  Typography,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  useEditAddonMutation,
  useGetAlladdonsQuery,
} from "../../Slices/AdminApi";

const EditAddons = ({ openForm, handleClose, editData, setSuccessMessage, setErrorMessage  }) => {
  const [updateAddon, { isLoading }] = useEditAddonMutation();
  const { data, refetch } = useGetAlladdonsQuery();
  const [formData, setFormData] = useState(() => ({
    item_name: editData?.item_name || "",
    quantity: editData?.quantity || "",
    price: editData?.price || "",
    item_type: editData?.item_type || [],
    item_image: null, // Keep null for new upload
  }));

  useEffect(() => {
    if (editData) {
      setFormData({
        item_name: editData.item_name || "",
        quantity: editData.quantity || "",
        price: editData.price || "",
        item_type: editData.item_type || [],
        item_image: null, // Reset to null so new image can be uploaded
      });
    }
  }, [editData]);

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
  console.log("Edit Addon ID: ", editData._id);
  const handleUpdateAddon = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("item_name", formData.item_name);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("price", formData.price);
      
      if (formData.item_image) {
        formDataToSend.append("item_image", formData.item_image);
      }
      
      formData.item_type.forEach((type) =>
        formDataToSend.append("item_type[]", type)
      );
  
      await updateAddon({
        addonsId: editData._id,
        data: formDataToSend,
      }).unwrap();
  
      setSuccessMessage("Addon updated successfully!");
      refetch();
      handleClose();
    } catch (error) {
      console.error("Update Failed:", error);
      setErrorMessage(error?.data?.message);
    }
  };
  

  return (
    <Dialog open={openForm} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Edit Addon
      </DialogTitle>

      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
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

            <Grid item xs={12}>
              <TextField
                name="price"
                label="Price"
                variant="outlined"
                fullWidth
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>

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
                id="file-upload-edit"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload-edit">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ backgroundColor: "#2c387e", color: "white" }}
                >
                  Upload New Image
                </Button>
              </label>
              {formData.item_image ? (
                <Typography variant="body2" color="textSecondary">
                  {formData.item_image.name}
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  (Current Image: {editData.item_image})
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button
          onClick={handleUpdateAddon}
          sx={{ backgroundColor: "#2c387e", color: "white" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress
                size={20}
                sx={{ color: "white", marginRight: 1 }}
              />
              Updating...
            </Box>
          ) : (
            "Update Addon"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAddons;

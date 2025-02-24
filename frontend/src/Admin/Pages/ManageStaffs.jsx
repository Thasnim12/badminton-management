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
  Alert,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useAddstaffsMutation, useGetStaffsQuery } from "../../Slices/AdminApi";

export default function ManageStaffs({ openForm, handleClose, setSnackbar }) {
  const { data, refetch } = useGetStaffsQuery();
  const [addStaff, { isLoading }] = useAddstaffsMutation();
  const [errors, setErrors] = useState({});
  const [staffImage, setStaffImage] = useState(null); // State to store the uploaded image

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneno || !phoneRegex.test(formData.phoneno)) {
      newErrors.phoneno = "Please enter a valid 10-digit phone number";
    }

    if (!formData.designation || formData.designation.trim().length < 2) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.employee_id || formData.employee_id.trim() === "") {
      newErrors.employee_id = "Employee ID is required";
    }

    if (!formData.joining_date) {
      newErrors.joining_date = "Joining date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStaff = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const staffData = Object.fromEntries(formData.entries());
    console.log(staffData);
    // Append the staff image if available
    if (staffImage) {
      formData.append("staff_image", staffImage);
    }
    console.log(staffImage);
    if (!validateForm(staffData)) {
      setSnackbar({
        open: true,
        message: "Please check all required fields",
        type: "error",
      });
      return;
    }

    try {
      const response = await addStaff(formData).unwrap();
      console.log(response, "Response");
      refetch();
      setSnackbar({
        open: true,
        message: "Staff added successfully!",
        type: "success",
      });
      handleClose();
    } catch (error) {
      if (error?.data?.message?.includes("email")) {
        setSnackbar({
          open: true,
          message: "Email already exists!",
          type: "error",
        });
      } else if (error?.data?.message?.includes("employee_id")) {
        setSnackbar({
          open: true,
          message: "Employee ID already exists!",
          type: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: error?.data?.message || "Error adding staff",
          type: "error",
        });
      }
    }
  };

  const handleFieldChange = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setStaffImage(file);
    }
  };

  return (
    <Dialog
      open={openForm}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleAddStaff,
      }}
    >
      <DialogTitle>Add New Staff</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              onChange={() => handleFieldChange("name")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              onChange={() => handleFieldChange("email")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phoneno"
              label="Phone Number"
              variant="outlined"
              fullWidth
              onChange={() => handleFieldChange("phoneno")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="designation"
              label="Designation"
              variant="outlined"
              fullWidth
              onChange={() => handleFieldChange("designation")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="employee_id"
              label="Employee ID"
              variant="outlined"
              fullWidth
              onChange={() => handleFieldChange("employee_id")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="joining_date"
              label="Joining Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              onChange={() => handleFieldChange("joining_date")}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Staff Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {staffImage && (
              <Box mt={2}>
                <span>{staffImage.name}</span>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
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
          sx={{
            backgroundColor: "#2c387e",
            color: "white",
            "&:hover": {
              backgroundColor: "#1a237e",
            },
          }}
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
            "Add Staff"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

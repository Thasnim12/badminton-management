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
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useUpdateStaffMutation,
  useGetStaffsQuery,
} from "../../Slices/AdminApi";

export default function EditStaffs({ openForm, handleClose, editData }) {
  const { data, refetch } = useGetStaffsQuery();
  const [editStaff, { isLoading }] = useUpdateStaffMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState({});
  const [staffData, setStaffData] = useState({
    name: editData.name || "",
    email: editData.email || "",
    phoneno: editData.phoneno || "",
    designation: editData.designation || "",
    employee_id: editData.employee_id || "",
    joining_date: editData.joining_date || "",
    staff_image: null,
  });

  useEffect(() => {
    if (editData) {
      //   const editData = data?.find((staff) => staff.id === editData);
      //   if (editData) {
      setStaffData({
        name: editData.name || "",
        email: editData.email || "",
        phoneno: editData.phoneno || "",
        designation: editData.designation || "",
        employee_id: editData.employee_id || "",
        joining_date: editData.joining_date || "",
        staff_image: null,
      });
      //   }
    }
  }, [editData]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditStaff = async (event) => {
    event.preventDefault();
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", staffData.name);
      formDataToSend.append("email", staffData.email);
      formDataToSend.append("designation", staffData.designation);
      formDataToSend.append("employee_id", staffData.employee_id);
      formDataToSend.append("joining_date", staffData.joining_date);
      formDataToSend.append("phoneno", staffData.phoneno);
  
      if (staffData.staff_image) {
        formDataToSend.append("staff_image", staffData.staff_image);
      }
      
      console.log(staffData.staff_image, "Image");
  
      const response = await editStaff({ employee_id: editData.employee_id, formData: formDataToSend }).unwrap(); 
      console.log(response, "Response");
  
      refetch();
      setSnackbar({
        open: true,
        message: "Staff details updated successfully!",
        severity: "success",
      });
      handleClose();
    } catch (error) {
      console.error("Update Failed:", error);
      setSnackbar({
        open: true,
        message: error?.data?.message || "Error updating staff details",
        severity: "error",
      });
    }
  };
  

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleFieldChange = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle image file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setStaffData({ ...staffData, staff_image: file }); // Store the selected file
    }
  };

  return (
    <Dialog
      open={openForm}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleEditStaff,
      }}
    >
      <DialogTitle>Edit Staff Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              defaultValue={staffData.name}
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
              defaultValue={staffData.email}
              onChange={() => handleFieldChange("email")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phoneno"
              label="Phone Number"
              variant="outlined"
              fullWidth
              defaultValue={staffData.phoneno}
              onChange={() => handleFieldChange("phoneno")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="designation"
              label="Designation"
              variant="outlined"
              fullWidth
              defaultValue={staffData.designation}
              onChange={() => handleFieldChange("designation")}
            />
          </Grid>
          {/* Disable fields for employee_id and joining_date */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="employee_id"
              label="Employee ID"
              variant="outlined"
              fullWidth
              value={staffData.employee_id}
              disabled
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
              value={staffData.joining_date}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Staff Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {staffData.staff_image ? (
              <Typography variant="body2" color="textSecondary">
                {staffData.staff_image.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                (Current Image: {editData.staff_image})
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="primary"
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
              Updating...
            </Box>
          ) : (
            "Update Staff"
          )}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

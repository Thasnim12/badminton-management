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
  Box
} from "@mui/material";
import { useSnackbar } from 'notistack';
import { useAddstaffsMutation } from "../../Slices/AdminApi";

export default function ManageStaffs({ openForm, handleClose }) {
  const [addStaff, { isLoading }] = useAddstaffsMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneno || !phoneRegex.test(formData.phoneno)) {
      newErrors.phoneno = "Please enter a valid 10-digit phone number";
    }

    // Designation validation
    if (!formData.designation || formData.designation.trim().length < 2) {
      newErrors.designation = "Designation is required";
    }

    // Employee ID validation
    if (!formData.employee_id || formData.employee_id.trim() === '') {
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

    if (!validateForm(staffData)) {
      enqueueSnackbar('Please check all required fields', { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      return;
    }

    try {
      const response = await addStaff(staffData).unwrap();
      enqueueSnackbar('Staff added successfully!', { 
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      handleClose();
    } catch (error) {
      if (error?.data?.message?.includes("email")) {
        enqueueSnackbar('Email already exists!', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else if (error?.data?.message?.includes("employee_id")) {
        enqueueSnackbar('Employee ID already exists!', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else {
        enqueueSnackbar(error?.data?.message || 'Error adding staff', { 
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    }
  };

  const handleFieldChange = (field) => {
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
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
              error={!!errors.name}
              helperText={errors.name}
              onChange={() => handleFieldChange('name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              onChange={() => handleFieldChange('email')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phoneno"
              label="Phone Number"
              variant="outlined"
              fullWidth
              error={!!errors.phoneno}
              helperText={errors.phoneno}
              onChange={() => handleFieldChange('phoneno')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="designation"
              label="Designation"
              variant="outlined"
              fullWidth
              error={!!errors.designation}
              helperText={errors.designation}
              onChange={() => handleFieldChange('designation')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="employee_id"
              label="Employee ID"
              variant="outlined"
              fullWidth
              error={!!errors.employee_id}
              helperText={errors.employee_id}
              onChange={() => handleFieldChange('employee_id')}
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
              error={!!errors.joining_date}
              helperText={errors.joining_date}
              onChange={() => handleFieldChange('joining_date')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          sx={{ 
            backgroundColor: "#2c387e", 
            color: "white",
            '&:hover': {
              backgroundColor: "#1a237e"
            }
          }} 
          disabled={isLoading}
        >
          {isLoading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={20} sx={{ color: "white", marginRight: 1 }} />
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

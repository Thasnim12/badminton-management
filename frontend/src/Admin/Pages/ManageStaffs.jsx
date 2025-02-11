import React,{ useState } from "react";
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
  Snackbar
} from "@mui/material";
import { useAddstaffsMutation } from "../../Slices/AdminApi";

export default function ManageStaffs({ openForm, handleClose }) {

    const [addStaff, { isLoading }] = useAddstaffsMutation();
  
  const handleAddStaff = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const staffData = Object.fromEntries(formData.entries());

    try {
      const response = await addStaff(staffData).unwrap();
      console.log("Staff added successfully:", response);
      handleClose();
    } catch (error) {
      console.error("Error adding staff:", error?.data?.message || error.message);
    }
  };

  return (
    <Dialog
      open={openForm}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleAddStaff, // Use the handler here
      }}
    >
      <DialogTitle>Add New Staff</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="name" label="Name" variant="outlined" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="email" label="Email" type="email" variant="outlined" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="phoneno" label="Phone Number" variant="outlined" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="designation" label="Designation" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="employee_id" label="Employee ID" variant="outlined" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="joining_date"
              label="Joining Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
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
            "Add Staff"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

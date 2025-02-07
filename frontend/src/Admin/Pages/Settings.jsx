import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import Layout from "../Global/Layouts";
const SettingsPage = () => {
  const [profileImage, setProfileImage] = useState("/default-profile.jpg"); // Default profile image
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [showImageOptions, setShowImageOptions] = useState(false); // Toggle image options visibility

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setShowImageOptions(false); // Hide options after selecting a new image
    }
  };

  // Handle removing profile image
  const handleRemoveImage = () => {
    setProfileImage("/default-profile.jpg");
    setShowImageOptions(false); // Hide options after removing the image
  };

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle saving the updated details
  const handleSaveChanges = () => {
    setIsEditing(false);
    // You can add logic here to save the updated details (e.g., make an API call)
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Update Profile
        </Typography>

        <Grid container spacing={3} alignItems="center">
          {/* Profile Image */}
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            position="relative"
          >
            <Avatar src={profileImage} sx={{ width: 100, height: 100 }} />
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "primary.main",
              }}
              onClick={() => setShowImageOptions(!showImageOptions)} // Toggle options visibility
            >
              <EditIcon sx={{ color: "white" }} />
            </IconButton>

            {/* Show Image Options (Upload & Remove Buttons) */}
            {showImageOptions && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  bgcolor: "white",
                  padding: "5px",
                  boxShadow: 2,
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  size="small"
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    onChange={handleProfileImageChange}
                  />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  size="small"
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>
              </Box>
            )}
          </Grid>

          {/* Name Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              variant="outlined"
              disabled={!isEditing} // Disable when not in editing mode
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
              disabled={!isEditing} // Disable when not in editing mode
            />
          </Grid>

          {/* Password Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              variant="outlined"
              disabled={!isEditing} // Disable when not in editing mode
            />
          </Grid>

          {/* Edit/Save Button */}
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                startIcon={<SaveIcon />}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                startIcon={<EditIcon />}
              >
                Edit Profile
              </Button>
            )}
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ marginTop: 3 }} />
      </Box>
    </Layout>
  );
};

export default SettingsPage;

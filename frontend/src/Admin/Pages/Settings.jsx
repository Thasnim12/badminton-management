import React, { useState, useEffect } from "react";
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
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Layout from "../Global/Layouts";
import { useGetAdminDetailsQuery } from "../../Slices/AdminApi";

const Settings = () => {
  const { data: user, error, isLoading } = useGetAdminDetailsQuery();
  const [profileImage, setProfileImage] = useState("/default-profile.jpg");
  const [formData, setFormData] = useState({
    name: "",
    passkey: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false); // To toggle visibility of passkey

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name,
        passkey: user?.passkey,
      });
      setProfileImage(user.profileImage || "/default-profile.jpg");
    }
  }, [user]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setShowImageOptions(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage("/default-profile.jpg");
    setShowImageOptions(false);
  };

  const handleTogglePasskeyVisibility = () => {
    setShowPasskey(!showPasskey);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading user details</Typography>;

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
        <Grid container spacing={3} alignItems="center">
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
              onClick={() => setShowImageOptions(!showImageOptions)}
            >
              <EditIcon sx={{ color: "white" }} />
            </IconButton>
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
                  variant="outlined"
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
                  variant="outlined"
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
              variant="outlined"
              disabled={!isEditing} // Disable when not in editing mode
            />
          </Grid>

          {/* Passkey Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Passkey"
              name="passkey"
              value={formData.passkey}
              variant="outlined"
              type={showPasskey ? "text" : "password"} // Toggle visibility of passkey
              disabled
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePasskeyVisibility}>
                    {showPasskey ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
        {/* Divider */}
        <Divider sx={{ marginTop: 3 }} />
      </Box>
    </Layout>
  );
};

export default Settings;

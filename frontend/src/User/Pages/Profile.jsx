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
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux"; // For accessing Redux store
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import {
  useGetUserDetailsQuery,
  useUpdateProfileMutation,
} from "../../Slices/UserApi";

const Profile = () => {



  const { userInfo } = useSelector((state) => state.userAuth);
  console.log(userInfo, "Userinfo")
  const user = userInfo.email; 
  console.log(user)
  const {data: getUser} = useGetUserDetailsQuery(user)
  const [updateProfile] = useUpdateProfileMutation();

  const [profileImage, setProfileImage] = useState("/default-profile.jpg");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: userInfo.name || "",
        email: user || "",
        mobile: userInfo.phoneno || "",
        password: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    setIsEditing(false);
    try {
      // Include profile image data with formData if it's updated
      const updatedData = await updateProfile({
        ...formData,
        profileImage: profileImage !== "/default-profile.jpg" ? profileImage : null,
      }).unwrap();

      console.log("Profile updated successfully", updatedData);

      // Clear form data after saving (reset values if needed)
      setFormData({
        name: updatedData.name || "",
        email: updatedData.email || "",
        mobile: updatedData.phoneno || "",
        password: "", // Keep password field empty
      });
      setProfileImage(updatedData.profileImage || "/default-profile.jpg");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const Section = styled(Box)(({ theme }) => ({
    padding: "60px 20px",
    width: "100%",
    textAlign: "center",
    backgroundColor: theme.palette.background.default,
    flexGrow: 1, // Ensures it takes the available space
  }));

  // const userId = user?.id; 
  // console.log("User ID from Redux:", userId);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Section>
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Update Profile
          </Typography>

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

            {/* Email Field (Non-editable) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                variant="outlined"
                disabled // Always disabled, email can't be edited
              />
            </Grid>

            {/* Mobile Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile"
                name="mobile"
                value={formData.mobile}
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
      </Section>
      <Footer />
    </Box>
  );
};

export default Profile;

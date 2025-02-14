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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import {
  useGetUserDetailsQuery,
  useUpdateProfileMutation,
} from "../../Slices/UserApi";
import { useDispatch } from "react-redux";
import { setUserCredentials } from "../../Slices/UserSlice";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const user = userInfo.email;
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

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, info, warning
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: userInfo.name || "",
        email: user || "",
        mobile: userInfo.phoneno || "",
        password: "",
      });
      setProfileImage(userInfo.profileImage || "/default-profile.jpg");
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

  const dispatch = useDispatch();

  const handleSaveChanges = async () => {
    setIsEditing(false);
    try {
      const response = await updateProfile({
        ...formData,
        profileImage:
          profileImage !== "/default-profile.jpg" ? profileImage : null,
      }).unwrap();

      console.log("Profile updated successfully:", response);

      const { user } = response;

      if (!user) {
        console.error("User data is missing in the response");
        return;
      }
      dispatch(
        setUserCredentials({
          name: user.name || "",
          email: user.email || "",
          phoneno: user.phoneno || "",
          profileImage: user.profileImage || "/default-profile.jpg",
        })
      );

      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.phoneno || "",
        password: "",
      });
      setProfileImage(user.profileImage || "/default-profile.jpg");

      setAlert({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating profile:", err);

      setAlert({
        open: true,
        message: "Error updating profile.",
        severity: "error",
      });
    }
  };

  const Section = styled(Box)(({ theme }) => ({
    padding: "60px 20px",
    width: "100%",
    textAlign: "center",
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
  }));

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

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
            </Grid>
            {isEditing && (
              <Grid
                item
                xs={12}
                container
                justifyContent="center"
                spacing={2} // This adds spacing between the buttons
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    size="small"
                    sx={{ marginBottom: 2 }}
                  >
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={handleProfileImageChange}
                      accept="image/*"
                    />
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    size="small"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                variant="outlined"
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                variant="outlined"
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end">
              {isEditing ? (
                <>
                  <Grid container display="flex" justifyContent="flex-end" spacing={2}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setIsEditing(false); // Cancel edit mode
                          setShowImageOptions(false); // Hide image options
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSaveChanges}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ marginTop: 3 }} />
        </Box>
      </Section>
      <Footer />

      {/* Snackbar for Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;

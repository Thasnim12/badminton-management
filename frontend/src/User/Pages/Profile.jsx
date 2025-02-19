import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Box,
  Divider,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  Pagination,
  Paper,
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
import { useUserBookingQuery } from "../../Slices/UserApi";
import BookingHistory from "../Components/BookingHistory";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const user = userInfo.email;
  const [updateProfile] = useUpdateProfileMutation();

  // const { data: bookingHistory } = useUserBookingQuery();
  // const loginBooking = bookingHistory?.bookings ?? [];

  // const userBookings = loginBooking.map(
  //   ({ _id, user, court, slot, payment, bookingDate, isCancelled }) => ({
  //     bookingId: _id,
  //     userId: user?._id,
  //     userName: user?.name,
  //     courtId: court?._id,
  //     courtName: court?.court_name,
  //     slots: slot.map(({ _id, startTime, endTime }) => ({
  //       slotId: _id,
  //       startTime,
  //       endTime,
  //     })),
  //     paymentStatus: payment?.status,
  //     amount: payment?.amount,
  //     currency: payment?.currency,
  //     bookingDate,
  //     isCancelled,
  //   })
  // );

  // console.log(userBookings, "BOOKINGS OF MINE");

  // console.log(loginBooking, "User BOoking");
  const [focusedField, setFocusedField] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

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

  const bookings = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    date: `2024-02-${10 + i}`,
    time: "10:00 AM - 11:00 AM",
    court: `Court ${i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C"}`,
    price: `$${20 + (i % 5) * 5}`,
    status: i % 2 === 0 ? "Confirmed" : "Pending",
  }));

  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(bookings.length / rowsPerPage);

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
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile", formData.mobile);

      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await updateProfile(formDataToSend).unwrap();
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
        profileImage: user.profileImage || "/default-profile.jpg",
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
    <>
      <Header />
      <Section>
        <Box
          sx={{ display: "flex", flexDirection: "column", marginTop: "25px" }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            sx={{ mb: 1 }}
          >
            <Tab label="Profile" />
            <Tab label="Booking History" />
          </Tabs>

          {tabIndex === 0 && (
            <Box sx={{ padding: 3 }}>
              <Grid sx={{ padding: 3, margin: "auto", maxWidth: 600 }}>
                <Typography variant="h5" gutterBottom>
                  Update Profile
                </Typography>

                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Avatar
                      src={`http://localhost:5000/uploads/${user.profileImage}` || "/default-profile.jpg"}
                      sx={{ width: 100, height: 100 }}
                    />
                  </Grid>

                  {isEditing && (
                    <Grid
                      item
                      xs={12}
                      container
                      justifyContent="center"
                      spacing={2}
                    >
                      <Grid item>
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
                            onChange={(e) =>
                              setProfileImage(
                                URL.createObjectURL(e.target.files[0])
                              )
                            }
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
                          onClick={() => setProfileImage(null)}
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
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          name: e.target.value,
                        }))
                      }
                      variant="outlined"
                      disabled={!isEditing}
                      autoFocus={focusedField === "name"} // Autofocus only if "name" field is being edited
                      onFocus={() => setFocusedField("name")} // Track when the name field is focused
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
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          mobile: e.target.value,
                        }))
                      }
                      variant="outlined"
                      disabled={!isEditing}
                      autoFocus={focusedField === "mobile"} // Autofocus only if "mobile" field is being edited
                      onFocus={() => setFocusedField("mobile")} // Track when the mobile field is focused
                    />
                  </Grid>

                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleSaveChanges}
                          sx={{ ml: 2 }}
                        >
                          Save
                        </Button>
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
              </Grid>
            </Box>
          )}

          {tabIndex === 1 && <BookingHistory />}
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
      </Section>
      <Footer />
    </>
  );
};

export default Profile;

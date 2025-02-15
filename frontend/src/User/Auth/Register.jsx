import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  Link,
  Container,
  Modal,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import {
  LockOutlined,
  MailOutlined,
  PersonOutline,
  PhoneOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  useRegisterUserMutation,
  useVerifyOtpMutation,
} from "../../Slices/UserApi";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setUserCredentials } from "../../Slices/UserSlice";

const validationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  phoneno: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid mobile number")
    .required("Mobile number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/,
      "Password must be a Strong password "
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerUser, { isLoading: isRegistering, error: registerError }] =
    useRegisterUserMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp, error: otpError }] =
    useVerifyOtpMutation();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleRegistration = async (data) => {
    try {
      const response = await registerUser({
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        password: data.password,
        phoneno: data.phoneno,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      if (response) {
        const user = response.user;
        setUserId(user._id);
      }

      showSnackbar("Registration successful!", "success");
      setOpenOtpModal(true);
    } catch (error) {
      console.error("Registration failed:", error);
      showSnackbar(error?.data?.message, "error");
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await verifyOtp({ userId, otp }).unwrap();
      if (response?.data?.status === "verified") {
        const { name, email, phoneno } = response.data;
        dispatch(setUserCredentials({ name, email, phoneno }));
        showSnackbar("Registration successful!", "success");
        setOpenOtpModal(false);
        
        // Force navigation after a small delay
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error("OTP validation failed:", error);
      showSnackbar(error?.data?.message, "error");
    }
  };

  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "87vh",
        }}
      >
        <Container component="main" maxWidth="xs">
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
              marginTop: "10px",
            }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              Sign Up
            </Typography>
            <form
              onSubmit={handleSubmit(handleRegistration)}
              style={{ width: "100%" }}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <PersonOutline style={{ marginRight: 8 }} />
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="phoneno"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile Number"
                    type="tel"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                    InputProps={{
                      startAdornment: (
                        <PhoneOutlined style={{ marginRight: 8 }} />
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <MailOutlined style={{ marginRight: 8 }} />
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <LockOutlined style={{ marginRight: 8 }} />
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <LockOutlined style={{ marginRight: 8 }} />
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={isRegistering}
              >
                {isRegistering ? "Registering..." : "Sign Up"}
              </Button>
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link onClick={() => navigate("/login")}>Log in here</Link>
                </Typography>
              </div>
            </form>
          </Card>
        </Container>
      </div>

      {/* OTP Modal */}
      <Modal
        open={openOtpModal}
        onClose={() => setOpenOtpModal(false)}
        aria-labelledby="otp-modal-title"
        aria-describedby="otp-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            padding: 2,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <IconButton
            onClick={() => setOpenOtpModal(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="h2"
            id="otp-modal-title"
            sx={{ fontSize: "18px", textAlign: "center" }}
          >
            Enter OTP sent to your Email to Complete Registration
          </Typography>
          <form onSubmit={handleOtpSubmit}>
            <TextField
              label="OTP"
              type="text"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ fontSize: "14px" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              disabled={isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </div>
  );
};

export default Register;

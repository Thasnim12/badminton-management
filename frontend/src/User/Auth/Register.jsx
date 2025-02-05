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
} from "@mui/material";
import {
  LockOutlined,
  MailOutlined,
  PersonOutline,
  PhoneOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../Global/Header";
import Footer from "../Global/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData.entries());

    console.log("Registration values:", values);
    // Replace with actual API call for registration

    // After successful registration, open OTP modal
    setOpenOtpModal(true);
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    // Replace with actual OTP validation logic
    if (otp === "123456") { // Example OTP check
      alert("Registration successful!");
      navigate("/login"); // Redirect to login or dashboard
    } else {
      alert("Invalid OTP. Please try again.");
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
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="Full Name"
                name="name"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <PersonOutline style={{ marginRight: 8 }} />,
                }}
              />

              <TextField
                label="Mobile Number"
                name="mobile"
                type="tel"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <PhoneOutlined style={{ marginRight: 8 }} />,
                }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <MailOutlined style={{ marginRight: 8 }} />,
                }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <LockOutlined style={{ marginRight: 8 }} />,
                }}
              />

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <LockOutlined style={{ marginRight: 8 }} />,
                }}
                helperText="Please confirm your password"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Sign Up
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
            >
              Verify OTP
            </Button>
          </form>
        </Box>
      </Modal>

      <Footer />
    </div>
  );
};

export default Register;

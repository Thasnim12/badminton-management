import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  Container,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  LockOutlined,
  MailOutlined,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
} from "@mui/icons-material"; // Added Visibility icons
import { useNavigate } from "react-router-dom";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

import { useLoginUserMutation } from "../../Slices/UserApi";
import { useDispatch } from "react-redux";
import { setUserCredentials } from "../../Slices/UserSlice";
import { useSnackbar } from "notistack";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import { useGoogleLoginMutation } from "../../Slices/UserApi";

const Login = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading: isLoggingIn, error: loginError }] =
    useLoginUserMutation();
  const [googleSignin, { isLoading: isGoogleLoggingIn }] =
    useGoogleLoginMutation();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // 'success' or 'error'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlertMessage("Please fill all fields");
      setAlertSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await loginUser({ email, password }).unwrap();
      if (response.user) {
        const { name, email, phoneno, role } = response.user;
        dispatch(setUserCredentials({ name, email, phoneno, role }));
        setAlertMessage("Login successful!");
        setAlertSeverity("success");
        setOpenSnackbar(true);
        navigate("/");
      }
    } catch (error) {
      setAlertMessage(error?.data?.message);
      setAlertSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const result = await googleSignin({ code: response.code }).unwrap();

        if (result.user) {
          dispatch(setUserCredentials(result.user));
          setAlertMessage("User logged in successfully");
          setAlertSeverity("success");
          setOpenSnackbar(true);
          navigate("/");
        } else {
          setAlertMessage("Google login failed. Please try again.");
          setAlertSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        setAlertMessage(error?.data?.message);
        setAlertSeverity("error");
        setOpenSnackbar(true);
      }
    },
    onError: (error) => {
      setAlertMessage("Google login failed. Please try again.");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    },
    flow: "auth-code",
    scope:
      "openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  });

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
              Log In
            </Typography>

            <form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <div>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: <MailOutlined style={{ marginRight: 8 }} />,
                  }}
                />
              </div>

              <div style={{ position: "relative" }}>
                <TextField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: <LockOutlined style={{ marginRight: 8 }} />,
                    endAdornment: (
                      <Button
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{ background: "transparent" }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </Button>
                    ),
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={isLoggingIn} // Disable button while submitting
              >
                {isLoggingIn ? "Logging in..." : "Log In"}
              </Button>

              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  startIcon={<GoogleIcon />}
                  onClick={googleLogin}
                >
                  {isGoogleLoggingIn
                    ? "Logging in with Google..."
                    : "Sign in with Google"}
                </Button>
              </div>

              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link onClick={() => navigate("/register")}>
                    Sign up here
                  </Link>
                </Typography>
              </div>
            </form>
          </Card>
        </Container>
      </div>
      <Footer />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;

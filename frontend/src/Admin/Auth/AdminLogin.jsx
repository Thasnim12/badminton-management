import React, { useState, useEffect } from "react";
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
  PersonOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material"; // Added Visibility icons
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../Slices/AdminSlice";
import { useDispatch, useSelector } from "react-redux";

import { useLoginadminMutation } from "../../Slices/AdminApi";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useSnackbar } from "notistack";
// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .required("Name is required"),
  passkey: Yup.string().required("Password is required"),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loginAdmin, { isLoading: isLoggingIn, error: loginError }] =
    useLoginadminMutation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const adminInfo = useSelector((state) => state.adminAuth);
  console.log(adminInfo, "admin");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    const { name, passkey } = values;
    try {
      const response = await loginAdmin({ name, passkey }).unwrap();
      if (response.admin) {
        const admin = response.admin;
        dispatch(setCredentials({ name: admin.name }));
        navigate("/admin");
      }
    } catch (error) {
      console.error("Admin login failed:", error);
      setSnackbar({
        open: true,
        message: "Admin login failed. Please check your credentials.",
        severity: "error",
      });
    }
  };

  return (
    <div>
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
              Admin Log In
            </Typography>
            <Formik
              initialValues={{ name: "", passkey: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form style={{ width: "100%" }}>
                  <div>
                    <Field
                      name="name"
                      type="text"
                      as={TextField}
                      label="Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <PersonOutline style={{ marginRight: 8 }} />
                        ),
                      }}
                      error={touched.name && !!errors.name} // Show error state
                      helperText={touched.name && errors.name} // Show error message
                    />
                  </div>

                  <div style={{ position: "relative" }}>
                    <Field
                      name="passkey"
                      type={showPassword ? "text" : "password"}
                      as={TextField}
                      label="Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <LockOutlined style={{ marginRight: 8 }} />
                        ),
                        endAdornment: (
                          <Button
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{ background: "transparent" }}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </Button>
                        ),
                      }}
                      error={touched.passkey && !!errors.passkey} // Show error state
                      helperText={touched.passkey && errors.passkey} // Show error message
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    disabled={isSubmitting || isLoggingIn} // Disable button while submitting
                  >
                    {isSubmitting || isLoggingIn ? "Logging in..." : "Log In"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AdminLogin;

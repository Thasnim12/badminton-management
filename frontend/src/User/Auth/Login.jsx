import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  Container,
  Link,
} from "@mui/material";
import { LockOutlined, MailOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import { useLoginUserMutation } from "../../Slices/UserApi";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setUserCredentials } from "../../Slices/UserSlice";
import { useSnackbar } from "notistack";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
     .min(6, "Password must be at least 6 characters long")
     .matches(
       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/,
       "Password must be a Strong password "
     )
     .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading: isLoggingIn, error: loginError }] =
    useLoginUserMutation();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const response = await loginUser({ email, password }).unwrap();
      console.log(response)
      if(response.user){
        const user = response.user;
        const name = user.name
        const email = user.email
        const phoneno = user.phoneno
        const role = user.role
        console.log(user,'user')
        
        dispatch(setUserCredentials({ name,email,phoneno,role }))
        console.log("Login successful:", response);
        navigate("/");
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      enqueueSnackbar("Login failed. Please check your credentials.", {
        variant: "error",
      });
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
              Log In
            </Typography>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form style={{ width: "100%" }}>
                  <div>
                    <Field
                      name="email"
                      type="email"
                      as={TextField}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <MailOutlined style={{ marginRight: 8 }} />
                        ),
                      }}
                
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      style={{
                        color: "red",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
                    />
                  </div>

                  <div>
                    <Field
                      name="password"
                      type="password"
                      as={TextField}
                      label="Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <LockOutlined style={{ marginRight: 8 }} />
                        ),
                      }}
              
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{
                        color: "red",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
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

                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <Typography variant="body2">
                      Don't have an account?{" "}
                      <Link onClick={() => navigate("/register")}>Sign up here</Link>
                    </Typography>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

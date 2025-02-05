import React from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  Link,
  Container,
} from "@mui/material";
import { LockOutlined, MailOutlined } from "@mui/icons-material"; // Importing icons
import { useNavigate } from "react-router-dom";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData.entries());

    console.log("Login values:", values);
    alert("Login successful!");
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
              Login
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Login
              </Button>

              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link onClick={() => navigate("/register")}>
                    Register here
                  </Link>
                </Typography>
              </div>
            </form>
          </Card>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

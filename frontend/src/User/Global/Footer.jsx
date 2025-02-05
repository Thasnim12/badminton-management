import React from "react";
import { AppBar, Toolbar, Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => (
  <AppBar position="static" sx={{ top: "auto", bottom: 0, backgroundColor: "#333" }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
        © 2025 Your Company Name
      </Typography>
      <Button color="inherit" component={Link} to="/privacy">
        Privacy Policy
      </Button>
      <Button color="inherit" component={Link} to="/terms">
        Terms & Conditions
      </Button>
      <Button color="inherit" component={Link} to="/contact">
        Contact
      </Button>
      <Button color="inherit" component={Link} to="/faq">
        FAQ
      </Button>
    </Toolbar>
  </AppBar>
);

export default Footer;

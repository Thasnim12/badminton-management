import React from "react";
import { AppBar, Toolbar, Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => (
  <AppBar position="sticky">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {/* Add your logo or title here */}
      </Typography>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
      <Button color="inherit" component={Link} to="/about">
        About Us
      </Button>
      <Button color="inherit" component={Link} to="/contact">
        Contact
      </Button>
      <Button color="inherit" component={Link} to="/donate">
        Donate
      </Button>
      <Button color="inherit" component={Link} to="/bookings">
        Bookings
      </Button>
      <Button color="inherit" component={Link} to="/login">
        Login
      </Button>
    </Toolbar>
  </AppBar>
);

export default Header;


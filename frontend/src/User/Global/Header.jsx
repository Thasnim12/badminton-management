import React, { useState } from "react";
import { AppBar, Toolbar, Button, Typography, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { text: "Home", to: "/" },
    { text: "About Us", to: "/about" },
    { text: "Contact", to: "/contact" },
    { text: "Donate", to: "/donate" },
    { text: "Bookings", to: "/bookings" },
    { text: "Login", to: "/login" },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#007BFF" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: "1px" }}>
          {/* Add your logo or title here */}
        </Typography>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="nav-links">
            {navLinks.map((link) => (
              <Button
                key={link.text}
                component={Link}
                to={link.to}
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginX: 1,
                  transition: "0.3s",
                  "&:hover": {
                    color: "#FFD700",
                    transform: "scale(1.1)"
                  }
                }}
              >
                {link.text}
              </Button>
            ))}
          </div>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ "& .MuiDrawer-paper": { width: 250, backgroundColor: "#0056b3", color: "#fff" } }}
      >
        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.text}
              component={Link}
              to={link.to}
              onClick={handleDrawerToggle}
              sx={{ "&:hover": { backgroundColor: "#004494" } }}
            >
              <ListItemText primary={link.text} sx={{ textAlign: "center", fontWeight: "bold", color: "#FFD700" }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;



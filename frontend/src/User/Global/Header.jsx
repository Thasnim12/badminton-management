import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Remove user data
    setUserInfo(null); // Reset state
    handleMenuClose();
    navigate("/login"); // Redirect to login page
  };

  const navLinks = [
    { text: "Home", to: "/" },
    { text: "About Us", to: "/about" },
    { text: "Contact", to: "/contact" },
    { text: "Donate", to: "/donate" },
    { text: "Book Now", to: "/bookings" },
    { text: "Members", to: "/members" },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#2c387e" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/Logo.png"
            alt="Logo"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              marginRight: "8px",
            }}
          />
          {/* Add your logo or title here */}
          AVK Raja Yadav Trust
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
                  "&:hover": { color: "#FFD700", transform: "scale(1.1)" },
                }}
              >
                {link.text}
              </Button>
            ))}

            {/* Show Login button if not logged in */}
            {!userInfo ? (
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginX: 1,
                  transition: "0.3s",
                  "&:hover": { color: "#FFD700", transform: "scale(1.1)" },
                }}
              >
                Login
              </Button>
            ) : (
              // Show Profile Avatar if logged in
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ color: "#fff", marginLeft: 2 }}
                >
                  <Avatar sx={{ bgcolor: "#FFD700" }}>
                    {userInfo.name
                      ? userInfo.name.charAt(0).toUpperCase()
                      : "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    View Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
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
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#0056b3",
            color: "#fff",
          },
        }}
      >
        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.text}
              component={Link}
              to={link.to}
              onClick={handleDrawerToggle}
            >
              <ListItemText
                primary={link.text}
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#FFD700",
                }}
              />
            </ListItem>
          ))}

          {/* Show Login/Logout options in the mobile menu */}
          {!userInfo ? (
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={handleDrawerToggle}
            >
              <ListItemText
                primary="Login"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#FFD700",
                }}
              />
            </ListItem>
          ) : (
            <>
              <ListItem
                button
                component={Link}
                to="/profile"
                onClick={handleDrawerToggle}
              >
                <ListItemText
                  primary="View Profile"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#FFD700",
                  }}
                />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemText
                  primary="Logout"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#FFD700",
                  }}
                />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;

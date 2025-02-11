import React from "react";
import {
  AppBar, Toolbar, Typography, IconButton,
  Menu, MenuItem, Avatar, Stack
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutadminMutation } from "../../Slices/AdminApi";
import { adminlogout } from "../../Slices/AdminSlice";

const Header = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [logout] = useLogoutadminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    navigate('/admin/settings')
  };

  const handleLogout = async () => {
      await logout().unwrap()
      dispatch(adminlogout());
      navigate('/admin/login')
  }

  

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuClick} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>

        {/* User Avatar and Dropdown */}
        <IconButton size="large" edge="end" color="inherit" onClick={handleMenuClick}>
          <Avatar alt="Admin" src="/static/images/avatar/1.jpg" />
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",  // Opens below the avatar
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",  // Positions the menu correctly
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          sx={{ mt: 1 }} // Adds a small margin for spacing
        >
          <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );

};

export default Header;

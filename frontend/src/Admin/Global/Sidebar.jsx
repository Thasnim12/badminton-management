import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UsersIcon from "@mui/icons-material/Group";
import DonationsIcon from "@mui/icons-material/Payment";
import BookingsIcon from "@mui/icons-material/Book";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SportsTennis from "@mui/icons-material/SportsTennis";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 290;

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Profile dropdown state
  const [anchorEl, setAnchorEl] = useState(null);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout function
  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here (e.g., clearing auth tokens, redirecting)
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={onClose} 
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          justifyContent: "space-between",
          marginTop: "64px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={handleProfileMenuOpen}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
          <Typography variant="subtitle1">Admin</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Profile Dropdown Menu */}
      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <PersonIcon sx={{ marginRight: 1 }} /> View Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToAppIcon sx={{ marginRight: 1 }} /> Logout
        </MenuItem>
      </Menu> */}

      <Divider />

      {/* Navigation List */}
      <List>
        <ListItemButton component="a" href="/admin">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component="a" href="/admin/users">
          <ListItemIcon>
            <UsersIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
        <ListItemButton component="a" href="/admin/manage-donations">
          <ListItemIcon>
            <DonationsIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Donations" />
        </ListItemButton>
        <ListItemButton component="a" href="/admin/manage-bookings">
          <ListItemIcon>
            <BookingsIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Bookings" />
        </ListItemButton>
        <ListItemButton component="a" href="/admin/manage-payments">
          <ListItemIcon>
            <CurrencyRupeeIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Payments" />
        </ListItemButton>
        <ListItemButton component="a" href="/admin/manage-courts">
          <ListItemIcon>
            <SportsTennis />
          </ListItemIcon>
          <ListItemText primary="Manage Courts" />
        </ListItemButton>
      </List>

      <Divider />

      {/* Settings Section */}
      <List>
        <ListItemButton component="a" href="/admin/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;

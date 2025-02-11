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
import { useTheme } from "@mui/material/styles";
import { adminlogout } from "../../Slices/AdminSlice";
import { useLogoutadminMutation } from "../../Slices/AdminApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const drawerWidth = 290;
const collapsedDrawerWidth = 80; // Width for collapsed state

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [collapsed, setCollapsed] = useState(false); // Manage collapsed state

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  const [logout] = useLogoutadminMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout().unwrap()
        dispatch(adminlogout());
        navigate('/admin/login')
    }
  

  return (
    <Drawer
      sx={{
        width: collapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedDrawerWidth : drawerWidth,
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
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
          <Typography variant="subtitle1">{collapsed ? "" : "Admin"}</Typography> {/* Conditionally show text */}
        </Box>
        <IconButton onClick={handleCollapseToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Navigation List */}
      <List>
        <ListItemButton component="a" href="/admin">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Dashboard" />}
        </ListItemButton>
        <ListItemButton component="a" href="/admin/users">
          <ListItemIcon>
            <UsersIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Users" />}
        </ListItemButton>
        <ListItemButton component="a" href="/admin/manage-donations">
          <ListItemIcon>
            <DonationsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Manage Donations" />}
        </ListItemButton>
        <ListItemButton component="a" href="/admin/manage-bookings">
          <ListItemIcon>
            <BookingsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Manage Bookings" />}
        </ListItemButton>
        <ListItemButton component="a" href="/admin/manage-payments">
          <ListItemIcon>
            <CurrencyRupeeIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Manage Payments" />}
        </ListItemButton>
        <ListItemButton component="a" href="/admin/manage-courts">
          <ListItemIcon>
            <SportsTennis />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Manage Courts" />}
        </ListItemButton>
      </List>

      <Divider />

      {/* Settings Section */}
      <List>
        <ListItemButton component="a" href="/admin/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Settings" />}
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Logout" />}
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;

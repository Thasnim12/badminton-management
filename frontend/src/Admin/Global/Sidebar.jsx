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
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useTheme } from "@mui/material/styles";
import { adminlogout } from "../../Slices/AdminSlice";
import { useLogoutadminMutation } from "../../Slices/AdminApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for declarative routing

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
    await logout().unwrap();
    dispatch(adminlogout());
    navigate('/admin/login');
  };

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
          <Avatar sx={{ backgroundColor: "#2c387e" }}>A</Avatar>
          <Typography variant="subtitle1">{collapsed ? "" : "Admin"}</Typography> {/* Conditionally show text */}
        </Box>
        <IconButton onClick={handleCollapseToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Navigation List */}
      <List>
        <ListItemButton component={Link} to="/admin">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Dashboard" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/users">
          <ListItemIcon>
            <UsersIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Users" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/manage-staffs">
          <ListItemIcon>
            <UsersIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Staffs" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/manage-courts">
          <ListItemIcon>
            <SportsTennis />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Courts" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/manage-donations">
          <ListItemIcon>
            <DonationsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Donations" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/manage-bookings">
          <ListItemIcon>
            <BookingsIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Bookings" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/manage-payments">
          <ListItemIcon>
            <CurrencyRupeeIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Payments" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/manage-addons">
          <ListItemIcon>
            <InventoryOutlinedIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Addons" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/manage-banner">
          <ListItemIcon>
            <ViewCarouselIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Banner images" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/admin/enquiry">
          <ListItemIcon>
            <NotificationsActiveIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Enquiry" />}
        </ListItemButton>
      </List>

      <Divider />

      {/* Settings Section */}
      <List>
        <ListItemButton component={Link} to="/admin/settings">
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

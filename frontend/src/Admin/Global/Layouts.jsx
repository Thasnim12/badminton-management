import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Fixed Header */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200, // Ensure header stays above sidebar
        }}
      >
        <Header onMenuClick={handleMenuClick} />
      </Box>

      {/* Adjusted Sidebar Position */}
      <Box
        sx={{
          position: 'fixed',
          top: 72, // Moved down a bit so it isn't hidden by the header
          left: 0,
          bottom: 0,
          width: 240, // Sidebar width
          zIndex: 1100, // Ensure sidebar is below header
          display: sidebarOpen ? 'block' : 'none',
        }}
      >
        <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginTop: '50px', // Adjusted to match sidebar position
          marginLeft: sidebarOpen ? '240px' : '0px',
          transition: 'margin-left 0.3s ease',
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;




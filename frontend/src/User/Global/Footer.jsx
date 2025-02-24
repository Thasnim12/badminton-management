import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import TermsModal from "../Components/TermsModal";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const routes = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Donate", path: "/donate" },
    { label: "Terms & Conditions" },
    { label: "Sign In", path: "/register" },
  ];

  useEffect(() => {
    const currentIndex = routes.findIndex(
      (route) => route.path === location.pathname
    );
    setValue(currentIndex !== -1 ? currentIndex : false);
  }, [location.pathname]);

  const handleTabClick = (index) => {
    if (routes[index].label === "Terms & Conditions") {
      setIsTermsOpen(true);
    } else {
      navigate(routes[index].path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Box
        component="footer"
        sx={{ backgroundColor: "#333", color: "#fff", py: 2 }}
      >
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Tabs
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
                textColor="inherit"
                indicatorColor="primary"
                orientation="vertical"
                sx={{
                  "& .MuiTab-root": {
                    color: "white",
                    textTransform: "none",
                    fontSize: "14px",
                    mb: 0.5,
                  },
                  "& .Mui-selected": { color: "primary.light" },
                }}
              >
                {routes.map((route, index) => (
                  <Tab
                    key={index}
                    label={route.label}
                    onClick={() => handleTabClick(index)}
                    sx={{
                      transition: "0.3s",
                      ":hover": { color: "primary.light" },
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Tabs>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body1">AVK Raja Yadav Trust</Typography>
              <Typography variant="body1">
                Register Number: R/V/B4/39/2024
              </Typography>
              <Typography variant="body1">Phone: +91 6385224527</Typography>
              <Typography variant="body1">
                Email: avkrajayadavtrust@gmail.com
              </Typography>
              <Box
                mt={1}
                component="iframe"
                width="80%"
                height="100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.8266816348378!2d78.8889145!3d9.3486005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0197260c1fef8f%3A0x6fefc8de3da2cd09!2sVani%20bus%20stop!5e0!3m2!1sen!2sin!4v1738821254996!5m2!1sen!2sin"
                sx={{
                  border: 0,
                  borderRadius: "6px",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </Grid>
          </Grid>
          <Box mt={2} textAlign="center">
            <Typography variant="body2" sx={{ fontSize: "12px" }}>
              © {new Date().getFullYear()} AVK Raja Yadav Trust | All Rights
              Reserved
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px", mt: 0.5 }}>
              Developed by Tunepath Technologies
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Terms & Conditions Modal */}
      <TermsModal open={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
};

export default Footer;

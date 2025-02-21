import React, { useState } from "react";
import { Box, Grid, Typography, Button, Paper, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../Global/Header";
import Footer from "../Global/Footer";

const ContentWrapper = styled(Box)({
  width: "100%",
  maxWidth: "1700px",
  padding: "0 20px",
});

const HeroSection = styled(Box)(({ theme }) => ({
  width: "100vw",
  height: "400px", // Fixed height
  backgroundImage: 'url("/Carousal2.jpg")',
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%", // Stretches image to fit width & height
  textAlign: "center",
  padding: "80px 20px",

  [theme.breakpoints.down("lg")]: {
    height: "380px", // Slightly reduce for large screens
  },

  [theme.breakpoints.down("md")]: {
    height: "350px", // Adjust for medium screens
  },

  [theme.breakpoints.down("sm")]: {
    height: "300px", // Reduce height on small screens
    padding: "40px 10px",
  },

  [theme.breakpoints.down("xs")]: {
    height: "250px", // Reduce height for extra small screens
    padding: "30px 5px",
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: "60px 20px",
  width: "100%",
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
}));

const PaperCard = styled(Paper)({
  padding: "30px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  textAlign: "center",
});

const Bookings = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const isLoggedIn = localStorage.getItem("userInfo");

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      setOpenSnackbar(true);
    } else {
      navigate("/book-now");
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100); // 
    }
  };
  return (
    <>
      <Header />

      <HeroSection />

      <Section>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5} display="flex" justifyContent="center">
              <Box
                component="img"
                src="https://media.istockphoto.com/id/1192023529/photo/asian-badminton-player-is-hitting-in-court.jpg?s=612x612&w=0&k=20&c=32rDisHRvLTxaetdlFHZ0lsaWqu3yYO21w-hv4Z29xs="
                alt="Online Badminton Court Booking in Chennai"
                sx={{
                  width: "80%", // Adjust the width to make it smaller
                  maxWidth: "500px", // Limit max size
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>

            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom>
                Online Badminton Court Booking for You
              </Typography>
              <Typography variant="body1" paragraph>
                Looking for somewhere to play Badminton? Our Association is a
                perfect indoor badminton court for both men and women. We offer
                online badminton court booking facilities at competitive prices.
                Now it’s time to get together with your friends or family and
                organize a badminton match. Whether you play regularly or just
                like to get out from time to time, our online booking program is
                the perfect way to enjoy a game at a reasonable price. Just book
                your desired session, show up, and play!
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleBookingClick}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom>
                Badminton Court Features
              </Typography>
              <Typography variant="body1" paragraph>
                We have badminton court facilities with wooden floors and wooden
                poles. The courts are sealed and good for your feet. Our court
                is mainly designed for the badminton experts, who have been
                playing badminton over the years. Our floor is coated with a
                unique material that prevents injuries, making our facility safe
                to play on. We offer flexible timing options, ranging from an
                hour to a whole day of playing.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleBookingClick}
              >
                Book Now
              </Button>
            </Grid>
            <Grid item xs={12} md={5} display="flex" justifyContent="center">
              <Box
                component="img"
                src="https://www.shutterstock.com/image-photo/badminton-court-without-people-night-600nw-2307374507.jpg" // Image path from public folder
                alt="Badminton Court Features"
                sx={{
                  width: "80%", // Adjust the width to make it smaller
                  maxWidth: "500px", // Limit max size
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5} display="flex" justifyContent="center">
              <Box
                component="img"
                src="https://5.imimg.com/data5/SELLER/Default/2023/8/333673974/QK/QB/AM/41246527/badminton-court-light-150-160w-500x500.jpeg" // Image path from public folder
                alt="Enhanced Lighting"
                sx={{
                  width: "80%", // Adjust the width to make it smaller
                  maxWidth: "500px", // Limit max size
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom>
                Better Visibility with Enhanced Lighting
              </Typography>
              <Typography variant="body1" paragraph>
                Don’t worry about what time it is! Book a badminton court online
                even after sunset.We have taken an initiative for providing
                efficient badminton court lighting facilities. Lighting gives
                clear visibility to play badminton games perfectly, even at
                night times. We ensure this facility helps every player to play
                more effectively and accurately.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleBookingClick}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Our Facilities
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <PaperCard>
                <CheckCircleIcon color="primary" />
                <Typography variant="h6">Changing Room</Typography>
              </PaperCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PaperCard>
                <CheckCircleIcon color="primary" />
                <Typography variant="h6">Locker</Typography>
              </PaperCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PaperCard>
                <CheckCircleIcon color="primary" />
                <Typography variant="h6">Charging Point</Typography>
              </PaperCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PaperCard>
                <CheckCircleIcon color="primary" />
                <Typography variant="h6">Drinking Water</Typography>
              </PaperCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PaperCard>
                <CheckCircleIcon color="primary" />
                <Typography variant="h6">Restrooms</Typography>
              </PaperCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PaperCard>
                <CheckCircleIcon color="primary" />
                <Typography variant="h6">Help Desk</Typography>
              </PaperCard>
            </Grid>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={handleBookingClick}
        >
          Reserve a Court Online
        </Button>
      </Section>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          You need to log in to book a court!
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default Bookings;

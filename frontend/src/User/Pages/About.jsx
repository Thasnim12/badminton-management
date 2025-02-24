import React from "react";
import { Box, Grid, Typography, Button, Paper, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../Global/Header";
import Footer from "../Global/Footer";

const ContentWrapper = styled(Box)({
  width: "100%",
  maxWidth: "1700px",
  padding: "0 20px",
});

const HeroSection = styled(Box)(({ theme }) => ({
  width: "100vw",
  height: "calc(100vw / 4.8)", // Maintain 1920x400 aspect ratio (400px height for 1920px width)
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start", // Align image to the top
  overflow: "hidden",

  [theme.breakpoints.down("lg")]: {
    height: "calc(100vw / 4.8)", // Maintain aspect ratio
  },

  [theme.breakpoints.down("md")]: {
    height: "calc(100vw / 4.8)", 
  },

  [theme.breakpoints.down("sm")]: {
    height: "calc(100vw / 4.8)", 
  },

  [theme.breakpoints.down("xs")]: {
    height: "calc(100vw / 4.8)", 
  },
}));

const HeroImage = styled("img")({
  width: "100%", // Full width
  height: "100%", // Full height of the container
  objectFit: "contain", // Ensure the whole image is visible without cropping
});
const Section = styled(Box)(({ theme }) => ({
  padding: "60px 20px",
  width: "100%",
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
}));

const InvolvedSection = styled(Box)(({ theme }) => ({
  padding: "60px 50px",
  [theme.breakpoints.down("md")]: {
    padding: "40px 30px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "30px 20px",
  },
  [theme.breakpoints.down("xs")]: {
    padding: "20px 15px",
  },
}));

const PaperCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "center",
  padding: "30px",
  minHeight: "200px", // Ensures all cards have equal height
  height: "100%",
  borderRadius: "12px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Custom fallback shadow

  [theme.breakpoints.down("sm")]: {
    padding: "20px",
    minHeight: "280px",
  },
}));

const AboutUs = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userAuth);
  const handleJoinClick = (e) => {
    e.preventDefault();
    navigate("/book-now"); // Always navigate to bookings
  
    window.scrollTo(0, 0); // Scroll to top
  };
  
  return (
    <>
      <Header />
      <HeroSection>
      <HeroImage src="/Carousal1.jpg" alt="Hero Banner" />
    </HeroSection>

      
      <Section>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5} display="flex" justifyContent="center">
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Badminton Court"
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
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                At AVK Raja Yadav Trust, our mission is to create opportunities
                for individuals through the sport of badminton. We organize
                tournaments to raise funds that help those in need. The spirit
                of competition on the court goes beyond the game — it is about
                making a positive impact in the lives of others.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom>
                "Badminton for a Cause"
              </Typography>
              <Typography variant="body1" paragraph>
                At AVK Raja Yadav Trust, each tournament you participate in or
                sponsor contributes directly to helping underprivileged
                communities. Your support helps us provide scholarships,
                educational resources, and more.
              </Typography>
            </Grid>

            <Grid item xs={12} md={5} display="flex" justifyContent="center">
              <Box
                component="img"
                src="https://content.jdmagicbox.com/comp/mumbai/i2/022pxx22.xx22.181021114020.f3i2/catalogue/vv-kuvale-badminton-academy-mumbai-taeqviawfi-250.jpg"
                alt="Badminton Court"
                sx={{
                  width: "100%",
                  maxWidth: "500px",
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
                src="https://t3.ftcdn.net/jpg/02/09/43/80/360_F_209438048_bqYPR1SZJx583icNF2fasiwfnttqMZZn.jpg"
                alt="Badminton Court"
                sx={{
                  width: "100%", // Adjust the width to make it smaller
                  maxWidth: "400px", // Limit max size
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom>
                Our Belief
              </Typography>
              <Typography variant="body1" paragraph>
                AVK Raja Yadav Trust was founded with the belief that sports can
                change lives. By combining our love for badminton with a passion
                for helping others, we created a platform where every swing of
                the racket contributes to a greater cause. Whether through funds
                raised from tournaments or the inspiration we spread, we aim to
                build a more compassionate, supportive world.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Section>

      <InvolvedSection>
        <Typography variant="h4" gutterBottom align="center">
          How You Can Get Involved
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <PaperCard>
              <Typography variant="h6">Participate</Typography>
              <Typography variant="body1">
                Join our tournaments and show your skills on the court while
                helping those in need.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleJoinClick}
              >
               Book a court
              </Button>
            </PaperCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PaperCard>
              <Typography variant="h6">Sponsor</Typography>
              <Typography variant="body1">
                Become a sponsor of our tournaments and show your support for a
                good cause.
              </Typography>
              <Link to="/donate"  onClick={() => window.scrollTo(0, 0)}>
                <Button variant="contained" color="primary">
                  Sponsor
                </Button>
              </Link>
            </PaperCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PaperCard>
              <Typography variant="h6">Donate</Typography>
              <Typography variant="body1">
                Even if you can’t participate in the tournaments, your donations
                will go a long way in making a difference in someone’s life.
              </Typography>
              <Link to="/donate"  onClick={() => window.scrollTo(0, 0)}>
                <Button variant="contained" color="primary">
                  Donate Now
                </Button>
              </Link>
            </PaperCard>
          </Grid>
        </Grid>
      </InvolvedSection>

      <Section>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Scholarships for Education
          </Typography>
          <Typography variant="body1" paragraph>
            We provide financial support for students to continue their
            education, ensuring that no one is held back due to financial
            constraints.We believe every student deserves the opportunity to
            reach their full potential, and we are here to help make that
            possible. Together, we can build a brighter future for the next
            generation of leaders, innovators, and change-makers.
          </Typography>

          <Link to="/donate"  onClick={() => window.scrollTo(0, 0)}>
            <Button variant="contained" color="primary">
              Make a change
            </Button>
          </Link>
        </Container>
      </Section>

      <Footer />
    </>
  );
};

export default AboutUs;

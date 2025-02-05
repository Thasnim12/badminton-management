import React from "react";
import { Container, Grid, Typography, Button, Box, Paper, TextField } from "@mui/material";
import { styled } from "@mui/system";
import Header from "./Global/Header";
import Footer from "./Global/Footer";
import Bookings from "./Pages/Bookings";
import { Link } from "react-router-dom";



const HeroSection = styled(Box)({
  backgroundImage: 'url("https://t3.ftcdn.net/jpg/03/10/62/12/360_F_310621281_foEqKBGtGlNWFQRePgdF5BpLOFyTsnzO.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  height:'400px',
  color: "white",
  textAlign: "center",
  width: "100%",
  marginTop: "5px",
});

const Section = styled(Box)({
  padding: "60px 0",
});

const AboutSection = styled(Box)({
  backgroundColor: "#f8f8f8",
  padding: "60px 0",
});

const InvolvedSection = styled(Box)({
  backgroundColor: "#fafafa",
  padding: "60px 0",
});

const ContactSection = styled(Box)({
  backgroundColor: "#0D47A1",
  padding: "60px 0",
  color: "white",
});

const PaperCard = styled(Paper)({
  padding: "30px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  textAlign: "center",
});

const HomePage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been submitted!");
  };

  return (
    <>
      <Header />
        {/* Hero Section */}
        <HeroSection>
          <Typography variant="h3" gutterBottom>
            Smash Your Game: Book Your Badminton Court Today!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Professional courts, expert coaches, and a fantastic experience await you.
          </Typography>
          <Link to="/bookings"> 
            <Button variant="contained" color="primary">
              Book Now
            </Button>
          </Link>
        </HeroSection>

        {/* About Us Section */}
        <AboutSection>
          <Typography variant="h4" gutterBottom align="center">
            Welcome to AVK Raja Yadav Trust!
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Our mission is to create opportunities for individuals through the sport of badminton. We organize tournaments to raise funds that help those in need. The spirit of competition on the court goes beyond the game — it is about making a positive impact in the lives of others.
          </Typography>
        </AboutSection>

        {/* Badminton for a Cause Section */}
        <Section>
          <Typography variant="h5" gutterBottom align="center">
            "Badminton for a Cause"
          </Typography>
          <Typography variant="body1" paragraph align="center">
            At AVK Raja Yadav Trust, each tournament you participate in or sponsor contributes directly to helping underprivileged communities. Your support helps us provide scholarships, educational resources, and more.
          </Typography>
        </Section>

        {/* Get Involved Section */}
        <InvolvedSection>
          <Typography variant="h4" gutterBottom align="center">
            How You Can Get Involved
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <PaperCard>
                <Typography variant="h6">Participate</Typography>
                <Typography variant="body1">
                  Join our tournaments and show your skills on the court while helping those in need.
                </Typography>
                <Button variant="contained" color="primary" component={Link} to="/book">
                  Join Now
                </Button>
              </PaperCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PaperCard>
                <Typography variant="h6">Sponsor</Typography>
                <Typography variant="body1">
                  Become a sponsor of our tournaments and show your support for a good cause.
                </Typography>
                <Button variant="contained" color="primary" component={Link} to="/sponsor">
                  Become a Sponsor
                </Button>
              </PaperCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PaperCard>
                <Typography variant="h6">Donate</Typography>
                <Typography variant="body1">
                  Even if you can’t participate in the tournaments, your donations will go a long way in making a difference in someone’s life.
                </Typography>
                <Link to="/donate"> 
                <Button variant="contained" color="primary" >
                  Donate Now
                </Button>
                </Link>
              </PaperCard>
            </Grid>
          </Grid>
        </InvolvedSection>

        {/* Scholarships for Education Section */}
        <Section>
          <Typography variant="h4" gutterBottom align="center">
            Scholarships for Education
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Providing financial support for students to continue their education. Your contributions help fund scholarships that enable students to reach their full potential and pursue their academic goals.
          </Typography>
        </Section>

        {/* Contact Section */}
        <ContactSection>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <PaperCard>
                  <form onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom>
                      Send Us A Message
                    </Typography>
                    <TextField
                      fullWidth
                      label="Your Name"
                      variant="outlined"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Your Email"
                      variant="outlined"
                      type="email"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Message"
                      variant="outlined"
                      multiline
                      rows={4}
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      type="submit"
                      sx={{ marginTop: 2 }}
                    >
                      Submit
                    </Button>
                  </form>
                </PaperCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ color: "#fff", textAlign: "left", padding: "20px" }}>
                  <Typography variant="h4" gutterBottom>
                    Contact Us
                  </Typography>
                  <Typography variant="body1" paragraph>
                    We'd love to hear from you! Please fill out the form, and we will get back to you as soon as possible.
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Court Info
                  </Typography>
                  <Typography variant="body1" paragraph>
                    AVK Raja Yadav Trust
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Address: 1234 Street, City, State, 56789
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Phone: +1 (234) 567-890
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Email: contact@avktrust.org
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </ContactSection>
      <Footer />
      </>
  );
};

export default HomePage;

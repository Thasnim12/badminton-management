import React from "react";
import { Box, Grid, Typography, Button, Paper, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";
import Header from "../Global/Header";
import Footer from "../Global/Footer";

const ContentWrapper = styled(Box)({
  width: "100%",
  maxWidth: "1700px",
  padding: "0 20px",
});

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/AWINCO BADMINTON COURT ELEVATION.jpg")', // Image path from the public folder
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "80px 20px",
  color: "white",
  height: "400px",
  textAlign: "center",
  width: "100%",
  marginTop: "5px",
}));

const InvolvedSection = styled(Box)({
  padding: "60px 50px",
});

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

const AboutUs = () => {
  return (
    <>
      <Header />

      <HeroSection>
        <Typography variant="h3" gutterBottom>
          Welcome to AVK Raja Yadav Trust!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Empowering communities through badminton tournaments for a cause.
        </Typography>
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
              <Link to="/register">
                <Button variant="contained" color="primary">
                  Join now
                </Button>
              </Link>
            </PaperCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PaperCard>
              <Typography variant="h6">Sponsor</Typography>
              <Typography variant="body1">
                Become a sponsor of our tournaments and show your support for a
                good cause.
              </Typography>
              <Link to="/donate">
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
              <Link to="/donate">
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

          <Link to="/donate">
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

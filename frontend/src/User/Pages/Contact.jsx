import React from "react";
import { Typography, Box, Paper, TextField, Button, Grid } from "@mui/material";
import { styled } from "@mui/system";
import Header from "../Global/Header";
import Footer from "../Global/Footer";

const MainContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
});

const BlueSection = styled(Box)({
  width: "100vw",
  backgroundColor: "#0D47A1", // Aesthetic dark blue
  padding: "40px 0",
});

const BlueSectionContent = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
});

const FormContainer = styled(Paper)({
  padding: "30px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  width: "100%",
  maxWidth: "500px",
});

const TextContainer = styled(Box)({
  color: "#fff",
  padding: "20px",
  textAlign: "left",      // Left-align text for a natural reading flow
  flexGrow: 1,
  marginLeft: "60px",     // Shift the content to the right
});

const MapSection = styled(Box)({
  width: "100vw",
  marginLeft: "calc(50% - 50vw)",
  backgroundColor: "#f1f1f1",
  height: "50vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been submitted!");
  };

  return (
    <MainContainer>
      <Header />
      <BlueSection>
        <BlueSectionContent>
          <FormContainer>
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
          </FormContainer>
          <TextContainer>
            <Typography variant="h4" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              We'd love to hear from you! Please fill out the form on the left, and we will get back to you as soon as possible.
            </Typography>
            <Box mt={2}>
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
          </TextContainer>
        </BlueSectionContent>
      </BlueSection>

      <MapSection>
        <Box sx={{ width: "100%", height: "100%" }}>
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0357470481686!2d90.40658691513432!3d23.810219384581113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c73d7a9d1d07%3A0x5a3e7985599236bb!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1627557863355!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{
              border: "0",
              borderRadius: "8px",
              height: "100%",
            }}
            loading="lazy"
          ></iframe>
        </Box>
      </MapSection>
      <Footer />
    </MainContainer>
  );
};

export default Contact;

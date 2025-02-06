import React from "react";
import { Typography, Box, Paper, TextField, Button, Grid } from "@mui/material";
import { styled } from "@mui/system";
import Header from "../Global/Header";
import Footer from "../Global/Footer";


const BlueSection = styled(Box)({
  width: "100%",
  backgroundColor: "#0D47A1", 
  padding: "40px 0",
});

const BlueSectionContent = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  maxWidth: "1200px",
  margin: "0 auto",

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
  width: "100%",
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
    <>
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
                Register Number: R/V/B4/39/2024
              </Typography>
              <Typography variant="body1" paragraph>
                Address: Kalukoorani Village, Vani Bustop, Ramanathapuram, TamilNadu - 623536
              </Typography>
              <Typography variant="body1" paragraph>
                Phone: +91 6385224527
              </Typography>
              <Typography variant="body1" paragraph>
                Email: avkrajayadavtrust@gmail.com
              </Typography>
            </Box>
          </TextContainer>
        </BlueSectionContent>
      </BlueSection>

      <MapSection>
        <Box sx={{ width: "100%", height: "100%" }}>
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.8266816348378!2d78.8889145!3d9.3486005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0197260c1fef8f%3A0x6fefc8de3da2cd09!2sVani%20bus%20stop!5e0!3m2!1sen!2sin!4v1738821254996!5m2!1sen!2sin" 
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
    </>
  );
};

export default Contact;

import { React, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import Header from "../Global/Header";
import Footer from "../Global/Footer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSendMessageMutation } from "../../Slices/UserApi";
// Styling components
const BlueSection = styled(Box)(() => ({
  width: "100%",
  backgroundColor: "#0D47A1",
  padding: "40px 0",
}));

const BlueSectionContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  maxWidth: "1200px",
  margin: "0 auto",
  "@media (min-width: 600px)": {
    flexDirection: "row",
  },
}));

const FormContainer = styled(Paper)(() => ({
  padding: "30px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  width: "100%",
  maxWidth: "500px",
  marginBottom: "20px", // Add bottom margin for spacing on small screens
}));

const TextContainer = styled(Box)(() => ({
  color: "#fff",
  padding: "20px",
  textAlign: "left", // Left-align text for a natural reading flow
  flexGrow: 1,
  marginLeft: "0px", // Remove the left margin on small screens
  "@media (min-width: 600px)": {
    marginLeft: "60px", // Add left margin on larger screens
  },
}));

const MapSection = styled(Box)(() => ({
  width: "100%",
  backgroundColor: "#f1f1f1",
  height: "50vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  message: yup.string().required("Message is required"),
});

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const onSubmit = async (data) => {
    try {
      await sendMessage(data).unwrap();
      setAlert({
        open: true,
        message: "Message sent successfully!",
        severity: "success",
      });
      reset();
    } catch (error) {
      setAlert({
        open: true,
        message: "Failed to send message!",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Header />
      <BlueSection>
        <BlueSectionContent>
          <FormContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h6" gutterBottom>
                Send Us A Message
              </Typography>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                margin="normal"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
              />
              <TextField
                fullWidth
                label="Your Email"
                variant="outlined"
                type="email"
                margin="normal"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                margin="normal"
                {...register("message")}
                error={!!errors.message}
                helperText={errors.message ? errors.message.message : ""}
              />
              <Button
                variant="outlined"
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
              We'd love to hear from you! Please fill out the form on the left,
              and we will get back to you as soon as possible.
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
                Address: Kalukoorani Village, Vani Bustop, Ramanathapuram,
                TamilNadu - 623536
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
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position the snackbar at the top right
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default Contact;

import { React, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import Header from "./Global/Header";
import Footer from "./Global/Footer";
import { useSelector } from "react-redux";
import Bookings from "./Pages/Bookings";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSendMessageMutation } from "../Slices/UserApi";

const CarouselWrapper = styled(Box)({
  width: "100%",
  height: "400px", // Set the height same as HeroSection
  textAlign: "center",
  overflow: "hidden",
  // marginTop: "5px", // Adjust if needed
});

const StyledCarousel = styled(Carousel)({
  "& .carousel .slide img": {
    height: "400px",
    objectFit: "cover",
  },
});

const QuoteSection = styled(Box)({
  padding: "40px 0",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const QuoteImage = styled(Box)({
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  overflow: "hidden",
  marginRight: "20px",
});

const QuoteText = styled(Box)({
  maxWidth: "600px",
  fontStyle: "italic",
  fontSize: "1.2rem",
  color: "#555",
});
const Section = styled(Box)({
  marginBottom: "20px",
  padding: "60px 0",
});

const AboutSection = styled(Box)({
  backgroundColor: "#f8f8f8",
  padding: "60px 0",
});

const InvolvedSection = styled(Box)({
  padding: "60px 50px",
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

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  message: yup.string().required("Message is required"),
});

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const handleJoinClick = (e) => {
    e.preventDefault();
    console.log("Button clicked, userInfo:", userInfo);
    if (userInfo) {
      navigate("/bookings");
    } else {
      navigate("/register");
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("userInfo");

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      toast.error("You need to log in to book a court!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      navigate("/book-now");
    }
  };

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
      {/* Hero Section */}
      <CarouselWrapper>
        <StyledCarousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          interval={3000}
          showThumbs={false}
        >
          <div>
            <img src="/Carousal1.jpg" alt="Badminton Court" />
          </div>
          <div>
            <img src="/Carousal2.jpg" alt="Training Session" />
          </div>
          <div>
            <img src="/Carousal3.jpg" alt="Tournaments" />
          </div>
        </StyledCarousel>
      </CarouselWrapper>

      <QuoteSection>
        <QuoteImage>
          <img
            src="https://i0.wp.com/www.raptisrarebooks.com/images/192572/winston-churchill-the-greatest-figure-of-our-time-first-edition-signed.jpg?fit=1000%2C975&ssl=1"
            alt="Winston Churchill"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </QuoteImage>
        <Box>
          <Typography variant="h6" paragraph>
            "We make a living by what we get, but we make a life by what we
            give."
          </Typography>
          <Typography variant="body2" color="textSecondary">
            - Winston Churchill
          </Typography>
        </Box>
      </QuoteSection>

      <ToastContainer />

      {/* About Us Section */}
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
                Welcome to AVK Raja Yadav Trust!
              </Typography>
              <Typography variant="body1" paragraph>
                Our mission is to create opportunities for individuals through
                the sport of badminton. We organize tournaments to raise funds
                that help those in need. The spirit of competition on the court
                goes beyond the game — it is about making a positive impact in
                the lives of others.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* Badminton for a Cause Section */}
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
                src="https://media.istockphoto.com/id/1761333789/photo/badminton-shuttlecocks-and-racket-placed-in-the-corner-of-a-synthetic-field.jpg?s=612x612&w=0&k=20&c=3rr4BZqe1rDWsCe6LF_YPCXZe6Um5jizc6d6n96U1Q4="
                alt="Badminton Court"
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
                src="https://t3.ftcdn.net/jpg/00/38/59/44/360_F_38594431_y0XRoIsqk7hj1VLv8WzNFuccl2OTmpia.jpg"
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
                onClick={handleBookingClick}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </Container>
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
                Join our tournaments and show your skills on the court while
                helping those in need.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleJoinClick}
              >
                {userInfo ? "Book Now" : "Join now"}
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
              <Link to="/donate">
                <Button variant="outlined" color="primary">
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
                <Button variant="outlined" color="primary">
                  Donate Now
                </Button>
              </Link>
            </PaperCard>
          </Grid>
        </Grid>
      </InvolvedSection>

      {/* Scholarships for Education Section */}

      <Section>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
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
                <Button variant="outlined" color="primary">
                  Make a change
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} md={5} display="flex" justifyContent="center">
              <Box
                component="img"
                src="https://img.freepik.com/free-vector/books-with-money-loans-scholarships_603843-826.jpg"
                alt="Badminton Court"
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
      {/* Contact Section */}
      <ContactSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <PaperCard>
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
              </PaperCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ color: "#fff", textAlign: "left", padding: "20px" }}>
                <Typography variant="h4" gutterBottom>
                  Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                  We'd love to hear from you! Please fill out the form, and we
                  will get back to you as soon as possible.
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
                    Phone: +91 6385224527
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Email: avkrajayadavtrust@gmail.com
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </ContactSection>
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

export default HomePage;

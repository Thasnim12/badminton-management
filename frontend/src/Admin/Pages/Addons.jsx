import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Layout from "../Global/Layouts";
import Addaddons from "../Components/Addaddons";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import { useGetAlladdonsQuery } from "../../Slices/AdminApi"; // RTK Query hook
import BreadcrumbNav from "../Global/Breadcrumb";

const Addons = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const { data, error, isLoading } = useGetAlladdonsQuery();
  const addons = data?.addons || [];
  const [openImage, setOpenImage] = useState(false);

  const handleClickOpen = () => setOpenForm(true);
  const handleClose = () => setOpenForm(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setSelectedImage("");
  };

  return (
    <>
      <Layout sx={{ marginTop: "25px" }}>
        <Container sx={{ marginTop: "25px" }}>
          <BreadcrumbNav
            links={[
              { label: "Dashboard", path: "/admin" },
              { label: "Add ons", path: "/admin/manage-addons" },
            ]}
          />
          <Box sx={{ marginTop: "25px" }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={3}>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <VolunteerActivismIcon sx={{ mr: 1 }} />
                      Total
                    </Typography>
                    <Typography variant="h4"></Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={3}>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircleIcon sx={{ mr: 1 }} />
                      Rented
                    </Typography>
                    <Typography variant="h4"></Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={3}>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <HourglassEmptyIcon sx={{ mr: 1 }} />
                      Sold Out
                    </Typography>
                    <Typography variant="h4"></Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: "25px",
              }}
            >
              <Button
                variant="outlined"
                sx={{ backgroundColor: "#2c387e", color: "white" }}
                onClick={handleClickOpen}
              >
                Manage Addons
              </Button>
            </Box>
          </Grid>

          {/* Display loading or error messages */}
          {isLoading ? (
            <p>Loading add-ons...</p>
          ) : error ? (
            <p>Error fetching add-ons</p>
          ) : (
            <TableContainer sx={{ marginTop: "25px" }} component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="addons table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Image</TableCell>
                    <TableCell align="center">Item Name</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Item Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addons.map((addon) => (
                    <TableRow key={addon._id}>
                      <TableCell align="center">
                        <img
                          src={`http://localhost:5000/uploads/${addon.item_image}`}
                          alt={addon.item_name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleImageClick(
                              `http://localhost:5000/uploads/${addon.item_image}`
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="center">{addon.item_name}</TableCell>
                      <TableCell align="center">{addon.quantity}</TableCell>
                      <TableCell align="center">{addon.price}</TableCell>
                      <TableCell align="center">
                        {addon.item_type.join(", ")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>

        <Dialog open={openImage} onClose={handleCloseImage} maxWidth="md">
          <DialogTitle>Addon Image</DialogTitle>
          <DialogContent>
            <img
              src={selectedImage}
              alt="Addon"
              style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          </DialogContent>
        </Dialog>

        {openForm && (
          <Addaddons openForm={openForm} handleClose={handleClose} />
        )}
      </Layout>
    </>
  );
};

export default Addons;

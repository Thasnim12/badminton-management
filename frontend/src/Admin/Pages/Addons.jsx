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
} from "@mui/material";
import Layout from "../Global/Layouts";
import Addaddons from "../Components/Addaddons";
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
    <Layout sx={{ marginTop: "25px" }}>
      <Container sx={{ marginTop: "25px" }}>
        <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Add ons", path: "/admin/manage-addons" },
          ]}
        />
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
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

      {openForm && <Addaddons openForm={openForm} handleClose={handleClose} />}
    </Layout>
  );
};

export default Addons;

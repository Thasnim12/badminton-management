import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Paper,
  TableCell,
  Grid,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Table,
  Container,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupIcon from "@mui/icons-material/Group";
import BlockIcon from "@mui/icons-material/Block";
import { styled } from "@mui/material/styles";
import Layout from "../Global/Layouts";
import FullScreenDialog from "../Components/ViewCourt";
import {
  useAddcourtsMutation,
  useGetAllcourtsQuery,
} from "../../Slices/AdminApi";

const SlotManagement = () => {
  const [open, setOpen] = useState(false);
  const [courtName, setCourtName] = useState("");
  const [courtImage, setCourtImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedcourt, SetSelectedCourt] = useState("");

  const [addcourt] = useAddcourtsMutation();
  const { data: courts, refetch } = useGetAllcourtsQuery();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = (court) => {
    SetSelectedCourt(court);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleAddcourt = async () => {
    if (!courtName) {
      setErrorMessage("Please enter a court name and select an image.");
      return;
    }
    setErrorMessage("");

    const courtData = {
      court_name: courtName,
      court_image: courtImage,
    };

    try {
      const response = await addcourt(courtData).unwrap();
      setCourtImage("");
      setCourtName("");
      handleClose();
    } catch (error) {
      setErrorMessage("Failed to add court. Please try again.");
    }
  };

  const activeCourts =
    courts?.courts?.filter((court) => court.isActive).length || 0;
  const inactiveCourts =
    courts?.courts?.filter((court) => !court.isActive).length || 0;
  const totalCourts = courts?.courts?.length || 0;

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <GroupIcon sx={{ mr: 1 }} />
                  Total Courts
                </Typography>
                <Typography variant="h4">{totalCourts}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  Active Courts
                </Typography>
                <Typography variant="h4">{activeCourts}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <BlockIcon sx={{ mr: 1 }} />
                  Inactive Courts
                </Typography>
                <Typography variant="h4">{inactiveCourts}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            Add your court name and image to manage your courts and time slots!
          </DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2}>
              <TextField
                label="Court name"
                variant="filled"
                size="small"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                error={!courtName && errorMessage}
              />
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload files
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => setCourtImage(event.target.files[0])}
                  accept="image/*"
                />
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddcourt}>Add</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <TableContainer
            component={Paper}
            sx={{ marginTop: 4, maxWidth: "80%" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Court Name</TableCell>
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="center">Active</TableCell>
                  <TableCell align="center">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courts?.courts?.map((court) => (
                  <TableRow key={court._id}>
                    <TableCell align="center">{court.court_name}</TableCell>
                    <TableCell align="center">
                      {court.court_image ? (
                        <img
                          src={court.court_image}
                          alt={court.court_name}
                          style={{ width: 80, height: 50, objectFit: "cover" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color={court.isActive ? "success" : "error"}
                      >
                        {court.isActive ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        sx={{ backgroundColor: "#2c387e", color: "white" }}
                        onClick={() => handleOpenDialog(court)}
                      >
                        view
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {selectedcourt && (
          <FullScreenDialog
            dialogOpen={dialogOpen}
            handleCloseDialog={handleCloseDialog}
            court={selectedcourt}
          />
        )}
      </Container>
    </Layout>
  );
};

export default SlotManagement;

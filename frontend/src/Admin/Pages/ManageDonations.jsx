import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import BreadcrumbNav from "../Global/Breadcrumb";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useGetDonationsQuery } from "../../Slices/AdminApi";
import Layout from "../Global/Layouts";

const ManageDonations = () => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [donations, setDonations] = useState([]);
  const [paginatedDonations, setPaginatedDonations] = useState([]);
  const rowsPerPage = 7;

  const { data, error, isLoading } = useGetDonationsQuery();

  useEffect(() => {
    console.log("API Response:", data);

    const allDonations = Array.isArray(data) ? data : [];
    setDonations(allDonations);
    updatePaginatedData(allDonations, page);
  }, [data, page]);

  const updatePaginatedData = (allData, pageNumber) => {
    if (!Array.isArray(allData)) return;
    const startIndex = (pageNumber - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedDonations(allData.slice(startIndex, endIndex));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    updatePaginatedData(donations, value);
  };

  const handleOpenDetails = (donation) => {
    setSelectedDonation(donation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDonation(null);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const totalDonations = donations
    .filter((donation) => donation.payment_status === "completed")
    .reduce((total, donation) => total + donation.amount, 0);

  const completedCount = donations.filter(
    (donation) => donation.payment_status === "completed"
  ).length;
  const pendingCount = donations.filter(
    (donation) => donation.payment_status === "pending"
  ).length;
  const failedCount = donations.filter(
    (donation) => donation.payment_status === "failed"
  ).length;

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
      <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Donations", path: "/admin/manage-donations" },
          ]}
        />

        {/* Cards for Total Donations, Completed, Pending, and Failed Transactions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
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
                    Total Donations
                  </Typography>
                  <Typography variant="h4">
                    ₹{totalDonations.toFixed(2)}
                  </Typography>
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
                    Completed
                  </Typography>
                  <Typography variant="h4">{completedCount}</Typography>
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
                    Pending
                  </Typography>
                  <Typography variant="h4">{pendingCount}</Typography>
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
                    <ErrorIcon sx={{ mr: 1 }} />
                    Failed
                  </Typography>
                  <Typography variant="h4">{failedCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Donor Name
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Amount
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Currency
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Payment Method
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Date
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 16 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell align="center">{donation.donor_name}</TableCell>
                  <TableCell align="center">{donation.amount}</TableCell>
                  <TableCell align="center">{donation.currency}</TableCell>
                  <TableCell align="center">
                    {donation.payment_status}
                  </TableCell>
                  <TableCell align="center">
                    {donation.payment_method}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleOpenDetails(donation)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box  sx={{
            display: 'flex',
            justifyContent: 'center', 
            marginTop: '20px', 
          }}>
          <Pagination
            count={Math.ceil(donations.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

        {/* Donation Details Modal */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Donation Details</DialogTitle>
          <DialogContent>
            {selectedDonation && (
              <>
                <Typography>
                  <strong>Donor:</strong> {selectedDonation.donor_name}
                </Typography>
                <Typography>
                  <strong>Amount:</strong> {selectedDonation.amount}
                </Typography>
                <Typography>
                  <strong>Currency:</strong> {selectedDonation.currency}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {selectedDonation.payment_status}
                </Typography>
                <Typography>
                  <strong>Payment Method:</strong>{" "}
                  {selectedDonation.payment_method}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedDonation.created_at).toLocaleDateString()}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}  variant="outlined" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ManageDonations;

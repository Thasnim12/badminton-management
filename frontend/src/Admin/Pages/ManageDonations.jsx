import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useGetDonationsQuery } from "../../Slices/AdminApi";
import Layout from "../Global/Layouts"; 

const ManageDonations = () => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [open, setOpen] = useState(false);

  const { data: donations, error, isLoading } = useGetDonationsQuery();

  const handleOpenDetails = (donation) => {
    setSelectedDonation(donation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDonation(null);
  };

  if (isLoading) return <Typography>Loading...</Typography>;  // Show loading state
  if (error) return <Typography>Error: {error.message}</Typography>;  // Show error if fetching fails

  return (
    <Layout>
      <Container>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h4">Manage Donations</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Donor Name</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Currency</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Payment Method</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donations?.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{donation.donor_name}</TableCell>
                  <TableCell>{donation.amount}</TableCell>
                  <TableCell>{donation.currency}</TableCell>
                  <TableCell>{donation.payment_status}</TableCell>
                  <TableCell>{donation.payment_method}</TableCell>
                  <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDetails(donation)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Donation Details Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Donation Details</DialogTitle>
          <DialogContent>
            {selectedDonation && (
              <>
                <Typography><strong>Donor:</strong> {selectedDonation.donor_name}</Typography>
                <Typography><strong>Amount:</strong> {selectedDonation.amount}</Typography>
                <Typography><strong>Currency:</strong> {selectedDonation.currency}</Typography>
                <Typography><strong>Status:</strong> {selectedDonation.payment_status}</Typography>
                <Typography><strong>Payment Method:</strong> {selectedDonation.payment_method}</Typography>
                <Typography><strong>Date:</strong> {new Date(selectedDonation.created_at).toLocaleDateString()}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ManageDonations;

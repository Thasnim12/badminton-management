import React, { useState } from "react";
import { useGetMessagesQuery } from "../../Slices/AdminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Box,
  IconButton,
} from "@mui/material";
import Layout from "../Global/Layouts";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BreadcrumbNav from "../Global/Breadcrumb";

const Enquiries = () => {
  const { data, error, isLoading } = useGetMessagesQuery();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenDialog = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedEnquiry(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <Layout>
      <Container sx={{ marginTop: "25px" }}>
        <BreadcrumbNav
          links={[
            { label: "Dashboard", path: "/admin" },
            { label: "Enquiries", path: "/admin/enquiry" },
          ]}
        />
        <TableContainer component={Paper} sx={{ marginTop: "35px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((enquiry) => (
                <TableRow key={enquiry._id}>
                  <TableCell>{enquiry.name}</TableCell>
                  <TableCell>{enquiry.email}</TableCell>
                  <TableCell>{enquiry.message.slice(0, 50)}...</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleOpenDialog(enquiry)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            count={Math.ceil(data.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>

        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Enquiry Details</DialogTitle>
          <DialogContent>
            {selectedEnquiry && (
              <div>
                <p>
                  <strong>Name:</strong> {selectedEnquiry.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedEnquiry.email}
                </p>
                <p>
                  <strong>Message:</strong> {selectedEnquiry.message}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Enquiries;

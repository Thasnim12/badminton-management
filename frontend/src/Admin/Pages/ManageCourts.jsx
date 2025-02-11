import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DialogTitle from '@mui/material/DialogTitle';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAddcourtsMutation, useGetAllcourtsQuery } from '../../Slices/AdminApi';
import Layout from '../Global/Layouts';
import FullScreenDialog from '../Components/ViewCourt';

const SlotManagement = () => {

  const [open, setOpen] = useState(false);
  const [courtName, setCourtName] = useState('')
  const [courtImage, setCourtImage] = useState('')
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedcourt,SetSelectedCourt] = useState('')

  const [addcourt] = useAddcourtsMutation();
  const { data: courts, refetch } = useGetAllcourtsQuery();
  



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = (court) => {
    SetSelectedCourt(court)
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  const handleAddcourt = async () => {
    console.log('hello')
    if (!courtName) {
      setErrorMessage("Please enter a court name and select an image.");
      return;
    }
    setErrorMessage("");

    const courtData = {
      court_name: courtName,
      court_image: courtImage
    };


    try {
      const response = await addcourt(courtData).unwrap();
      console.log("Court added successfully:", response);
      setCourtImage("")
      setCourtName("")
      handleClose();
    } catch (error) {
      console.error("Error adding court:", error.message);
      setErrorMessage("Failed to add court. Please try again.");
    }
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button variant="contained" onClick={handleClickOpen}>Add court</Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add your court name and image to manage your courts and time slots!</DialogTitle>
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
              role={undefined}
              variant="contained"
              tabIndex={-1}
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

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: '80%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Court Name</strong></TableCell>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Active</strong></TableCell>
                <TableCell><strong>View</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courts?.courts?.map((court) => (
                <TableRow key={court._id}>
                  <TableCell>{court.court_name}</TableCell>
                  <TableCell>
                    {court.court_image ? (
                      <img
                        src={court.court_image}
                        alt={court.court_name}
                        style={{ width: 80, height: 50, objectFit: 'cover' }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={court.isActive ? "success" : "error"}
                    >
                      {court.isActive ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
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
      {selectedcourt && <FullScreenDialog dialogOpen={dialogOpen} handleCloseDialog={handleCloseDialog} court={selectedcourt} />}
    </Layout>
  );
};

export default SlotManagement;

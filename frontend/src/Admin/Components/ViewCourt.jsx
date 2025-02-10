import React, { useState, useEffect } from 'react';
import {
    Dialog,
    ListItemText,
    ListItemButton,
    List,
    Divider,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
    Pagination,
    TableCell,
    Table,
    Paper,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../Global/Layouts';
import { useManageslotsMutation, useGetAllslostQuery } from '../../Slices/AdminApi';
import ViewSlots from './ViewSlots';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ dialogOpen, handleCloseDialog, court }) {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [addSlot] = useManageslotsMutation();

    
    const [page, setPage] = useState(1);
    const slotsPerPage = 5; // Number of slots per page

    const { data: allSlots, isLoading, error } = useGetAllslostQuery(court?._id, {
        skip: !dialogOpen, // Fetch only when dialog is open
    });
    
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      useEffect(() => {
        if (court) {
            const addSlotAsync = async () => {
                try {
                    await addSlot({ courtId: court._id }).unwrap();
                    console.log("Slot added successfully");
                } catch (error) {
                    console.error("Error adding slot:", error);
                }
            };
    
            addSlotAsync();
        }
    }, [court, addSlot]);
    
    

    useEffect(() => {
        if (dialogOpen && allSlots) {
            setSlots(allSlots);
        }
    }, [dialogOpen, allSlots]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleView = (slot) => {
        setSelectedSlot(slot);
        setModalMode("view");
        setOpenModal(true);
    };

    const handleEdit = (slot) => {
        setSelectedSlot(slot);
        setModalMode("edit");
        setOpenModal(true);
    };

    const indexOfLastSlot = page * slotsPerPage;
    const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
    const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);

    return (
        <Layout>
            <Dialog fullScreen open={dialogOpen} onClose={handleCloseDialog} TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleCloseDialog} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Weekly Slots (Monday - Saturday)
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: 20 }}>
                    <Typography variant="h6">Available Slots</Typography>

                    {loading || isLoading ? (
                        <Typography>Loading slots...</Typography>
                    ) : error ? (
                        <Typography color="error">Error loading slots</Typography>
                    ) : slots.length > 0 ? (
                        <>
                            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><b>Date</b></TableCell>
                                            <TableCell align="center"><b>Time</b></TableCell>
                                            <TableCell align="center"><b>Price</b></TableCell>
                                            <TableCell align="center"><b>Actions</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentSlots.map((slot, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center">{new Date(slot.date).toDateString()}</TableCell>
                                                <TableCell align="center">{slot.startTime} - {slot.endTime}</TableCell>
                                                <TableCell align="center">₹0</TableCell>
                                                <TableCell align="center">
                                                    <Button variant="outlined" color="primary" onClick={() => handleView(slot)} sx={{ marginRight: 1 }}>
                                                        View
                                                    </Button>
                                                    <Button variant="contained" onClick={() => handleEdit(slot)}>
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                                <Pagination
                                    count={Math.ceil(slots.length / slotsPerPage)}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </div>
                        </>
                    ) : (
                        <Typography>No slots available.</Typography>
                    )}
                </div>
            </Dialog>
            <ViewSlots open={openModal} handleClose={() => setOpenModal(false)} slot={selectedSlot} mode={modalMode} />
        </Layout>
    );
}

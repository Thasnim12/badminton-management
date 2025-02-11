import React, { useState, useEffect } from 'react';
import {
    Dialog,
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
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../Global/Layouts';
import { useManageslotsMutation, useGetAllslostQuery } from '../../Slices/AdminApi';
import ViewSlots from './ViewSlots';
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ dialogOpen, handleCloseDialog, court }) {
    console.log(court, 'court')
    const [page, setPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [modalMode, setModalMode] = useState("");
    const slotsPerPage = 5;
    const courtId = court?._id
    console.log(courtId, 'id')

    const [addSlot] = useManageslotsMutation();
    const {
        data,
        isLoading,
        error,
        refetch
    } = useGetAllslostQuery(courtId, {
        skip: !courtId,
    });

    const slots = Array.isArray(data?.data) ? data.data : [];

    useEffect(() => {
        if (courtId && dialogOpen) {
            let isMounted = true; 
            const generateSlots = async () => {
                try {
                    await addSlot({ courtId: courtId }).unwrap();
                    if (isMounted) refetch(); 
                } catch (error) {
                    console.error("Error generating slots:", error);
                }
            };
    
            generateSlots();
    
            return () => {
                isMounted = false;
            };
        }
    }, []); 
    

    // Pagination handlers
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    console.log(slots, 'slot')

    const indexOfLastSlot = page * slotsPerPage;
    const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
    const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);

    // Modal handlers
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

    return (
        <Layout>
            <Dialog
                fullScreen
                open={dialogOpen}
                onClose={handleCloseDialog}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseDialog}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                            Weekly Slots (Monday - Saturday)
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: 20 }}>
                    <Typography variant="h6">Available Slots</Typography>

                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                            <CircularProgress />
                        </div>
                    ) : error ? (
                        <Typography color="error">
                            Error loading slots: {error.message}
                        </Typography>
                    ) : slots.length > 0 ? (
                        <>
                            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><b>Date</b></TableCell>
                                            <TableCell align="center"><b>Time</b></TableCell>
                                            <TableCell align="center"><b>Price</b></TableCell>
                                            <TableCell align="center"><b>Status</b></TableCell>
                                            <TableCell align="center"><b>Actions</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentSlots.map((slot) => (
                                            <TableRow key={slot._id}>
                                                <TableCell align="center">
                                                    {moment(slot.date).format('DD MMM YYYY')}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {moment(slot.startTime, "HH:mm").format('hh:mm A')} -
                                                    {moment(slot.endTime, "HH:mm").format('hh:mm A')}
                                                </TableCell>
                                                <TableCell align="center">
                                                    ₹{slot.price || 0}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {slot.isBooked ? 'Booked' : 'Available'}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleView(slot)}
                                                        sx={{ marginRight: 1 }}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleEdit(slot)}
                                                        disabled={slot.isBooked}
                                                    >
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

            <ViewSlots
                open={openModal}
                handleClose={() => setOpenModal(false)}
                slot={selectedSlot}
                mode={modalMode}
            />
        </Layout>
    );
}
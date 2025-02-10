import React,{ useState,useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { useUpdatecourtsMutation } from '../../Slices/AdminApi';

export default function ViewSlots({ open, handleClose, slot, mode }) {

    const [updateSlots, { isLoading: updating }] = useUpdatecourtsMutation();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [price, setPrice] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);
    console.log(mode,'mode')

    useEffect(() => {
        if (slot) {
            setStartTime(slot.startTime);
            setEndTime(slot.endTime);
            setPrice(slot.price);
        }
    }, [slot]);

    const handleSave = async () => {
        setOpenConfirm(true);
    };

    const confirmEdit = async () => {
        console.log(slot._id,'id')
        try {
            await updateSlots({
                slotId: slot._id,
                startTime:startTime,
                endTime:endTime,
                price:price,
            }).unwrap();

            alert('Slot updated successfully!');
            setOpenConfirm(false);
            handleClose();
        } catch (error) {
            console.error('Error updating slot:', error);
            alert('Failed to update slot.');
        }
    };


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{mode === "edit" ? "Edit Slot" : "View Slot"}</DialogTitle>
            <DialogContent>
                {slot ? (
                    <>
                        <Typography variant="subtitle1">Date: {new Date(slot.date).toDateString()}</Typography>
                        <TextField
                            label="Start Time"
                            value={startTime}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            onChange={(e) => setStartTime(e.target.value)}
                            disabled={mode === "view"} // Disable in view mode
                        />
                        <TextField
                            label="End Time"
                            value={endTime}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            onChange={(e) => setEndTime(e.target.value)}
                            disabled={mode === "view"}
                        />
                        <TextField
                            label="Price"
                            value={slot.price}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={mode === "view"}    
                        />
                    </>
                ) : (
                    <Typography>No slot data available.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                {mode === "edit" && <Button variant="contained" color="primary" onClick={confirmEdit}>Save</Button>}
            </DialogActions>
        </Dialog>
    );
}

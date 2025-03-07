import * as React from 'react';
import {
    Button, TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl, CircularProgress
} from '@mui/material';
import { useGetAllcourtsQuery, useGetSlotsQuery } from '../../Slices/UserApi';
import { useOfflinebookingsMutation } from '../../Slices/AdminApi';
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function OfflineBookingModal({ open, setOpen, handleSubmit }) {
    const { data: courts } = useGetAllcourtsQuery();
    const [selectedCourt, setSelectedCourt] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(null);

    const { data: slotsData, isLoading } = useGetSlotsQuery(
        selectedCourt && selectedDate ? { courtId: selectedCourt, date: selectedDate.format("YYYY-MM-DD") } : {},
        { skip: !selectedCourt || !selectedDate }
    );

    const [createOfflineBooking] = useOfflinebookingsMutation();

    console.log(slotsData)

    const [formData, setFormData] = React.useState({
        phoneno: '',
        userName: '',
        courtId: '',
        slotId: [],
        amount: '',
        addons: [],
        paymentMethod: 'Cash',
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Update selected court
        if (name === 'courtId') {
            setSelectedCourt(value);
        }
    };

    const handleSlotChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            slotId: e.target.value, // Multi-select
        }));
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await createOfflineBooking(formData).unwrap();
            console.log("Booking created:", response);
            handleClose();
        } catch (error) {
            console.error("Error creating booking:", error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Offline Booking</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Fill in the details to create an offline booking.
                </DialogContentText>

                {/* User Name (Optional) */}
                <TextField
                    margin="dense"
                    name="email"
                    label="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                />

                {/* Court Selection */}
                <FormControl fullWidth margin="dense">
                    <InputLabel>Court</InputLabel>
                    <Select name="courtId" value={formData.courtId} onChange={handleChange}>
                        {courts?.court.map((court) => (
                            <MenuItem key={court._id} value={court._id}>{court.court_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        fullWidth
                        margin="dense"
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                    />
                </LocalizationProvider>

                {/* Slot Selection (Multi-Select) */}
                <FormControl fullWidth margin="dense" disabled={!selectedCourt || !selectedDate}>
                    <InputLabel>Available Slots</InputLabel>
                    <Select multiple name="slotId" value={formData.slotId} onChange={handleSlotChange}>
                        {slotsData?.length > 0 ? (
                            slotsData
                                .filter(slot => {
                                    const slotStartTime = new Date(slot.startTime);
                                    const now = new Date();

                                    return !slot.isBooked && slotStartTime > now;
                                })
                                .map(slot => {
                                    const localStartTime = new Date(slot.startTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    });

                                    const localEndTime = new Date(slot.endTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    });

                                    return (
                                        <MenuItem key={slot._id} value={slot._id}>
                                            {localStartTime} - {localEndTime}
                                        </MenuItem>
                                    );
                                })
                        ) : (
                            <MenuItem disabled>No slots available</MenuItem>
                        )}
                    </Select>
                </FormControl>


                {/* Amount */}
                <TextField
                    margin="dense"
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    value={formData.amount}
                    onChange={handleChange}
                />


                {/* Payment Method */}
                <FormControl fullWidth margin="dense">
                    <InputLabel>Payment Method</InputLabel>
                    <Select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Card">Card</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                    </Select>
                </FormControl>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={handleFormSubmit}>Create Booking</Button>
            </DialogActions>
        </Dialog>
    );
}

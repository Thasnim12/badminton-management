import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Label,
    ResponsiveContainer
} from "recharts";
import Title from "./Title";

function createData(time, amount) {
    return { time, amount };
}

const data = [
    createData("00:00", 0),
    createData("03:00", 300),
    createData("06:00", 600),
    createData("09:00", 800),
    createData("12:00", 1500),
    createData("15:00", 2000),
    createData("18:00", 2400),
    createData("21:00", 2400),
    createData("24:00", undefined)
];

export default function Chart({ bookingsData }) {

    const formattedData = bookingsData.map((booking) => ({
        time: new Date(booking.createdAt).toLocaleDateString(), // Format date
        amount: booking.amount || 0, // Assuming `amount` is the booking fee
    }));

    return (
        <React.Fragment>
            <Title>Bookings Report</Title>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 16, right: 16, bottom: 16, left: 24 }}>
                    <XAxis dataKey="time" />
                    <YAxis>
                        <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
                            Booking Amount (₹)
                        </Label>
                    </YAxis>
                    <Line type="monotone" dataKey="amount" stroke="#556CD6" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}

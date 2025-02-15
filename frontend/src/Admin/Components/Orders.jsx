import React,{ useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

export default function DenseTable({ bookingsData }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell align="right">User Name</TableCell>
              <TableCell align="right">Court</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Time Slot</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookingsData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell component="th" scope="row">
                    {booking.payment?.razorpayOrderId || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {booking.user?.name || "Unknown"}
                  </TableCell>
                  <TableCell align="right">
                    {booking.court ? `${booking.court.court_name}` : "Not Assigned"}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {booking.slot.length > 0
                      ? `${new Date(booking.slot[0].startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - ${new Date(booking.slot[0].endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {booking.payment?.status || "Pending"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={bookingsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </>
  );
}

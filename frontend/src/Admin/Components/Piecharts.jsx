import { PieChart } from '@mui/x-charts/PieChart';
import Title from './Title';

const Piechart = ({ bookingsData }) => {

  console.log(bookingsData,'data-booking')

  const statusCounts = bookingsData.reduce(
    (acc, booking) => {
      acc[booking.payment.status] = (acc[booking.payment.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Failed: 0, Completed: 0 }
  );

  console.log(statusCounts,'count')

  return (
    <>
    <Title>Bookings Report</Title>
      <PieChart
        series={[
          {
             data: [
            { id: 0, value: statusCounts.Pending, label: "Pending" },
            { id: 1, value: statusCounts.Failed, label: "Failed" },
            { id: 2, value: statusCounts.Completed, label: "Completed" },
          ],
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: -45,
            endAngle: 225,
            cx: 150,
            cy: 150,
          },
        ]}
      />
    </>
  );
};

export default Piechart;

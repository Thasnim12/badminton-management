import { PieChart } from '@mui/x-charts/PieChart';

const Piechart = () => {
  return (
    <>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 30, label: "A" },
              { id: 1, value: 50, label: "B" },
              { id: 2, value: 20, label: "C" },
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

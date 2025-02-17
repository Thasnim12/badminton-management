import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import EventIcon from "@mui/icons-material/Event";
import {
  useGetDonationsQuery,
  useGetAllUsersQuery,
  useGetStaffsQuery,
  useGetBookingsQuery,
} from "../../Slices/AdminApi";

const SelectActionCard = () => {
  const [selectedCard, setSelectedCard] = React.useState(0);

  const { data: donationData, isLoading: isLoadingDonations } =
    useGetDonationsQuery();

  const { data, isLoading: isLoadingBookings } = useGetBookingsQuery();
  const totalBookings =
    data?.bookings?.filter(
      (booking) => booking?.payment?.status === "Completed"
    ).length || 0;

  const totalDonations =
    donationData
      ?.filter((donation) => donation.payment_status === "completed")
      .reduce((acc, donation) => acc + donation.amount, 0) || 0;

  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsersQuery();
  const totalUsers =
    usersData?.users?.filter((user) => user.is_blocked === false).length || 0;
  const { data: staffData, isLoading: isLoadingStaffs } = useGetStaffsQuery();
  const totalStaffs = staffData?.staffs?.length || 0;

  const cards = [
    {
      id: 1,
      title: "Bookings",
      description: isLoadingBookings
        ? "Loading..."
        : `Total Bookings: ${totalBookings}`,
      icon: <EventIcon fontSize="medium" sx={{ color: "black" }} />,
    },
    {
      id: 2,
      title: "Donations",
      description: isLoadingDonations
        ? "Loading..."
        : `Total: ₹${totalDonations.toFixed(2)}`,
      icon: <VolunteerActivismIcon fontSize="medium" sx={{ color: "black" }} />,
    },
    {
      id: 3,
      title: "Users",
      description: isLoadingUsers ? "Loading..." : `Total Users: ${totalUsers}`,
      icon: <GroupAddIcon fontSize="medium" sx={{ color: "black" }} />,
    },
    {
      id: 4,
      title: "Staffs",
      description: isLoadingStaffs
        ? "Loading..."
        : `Total Staffs: ${totalStaffs}`,
      icon: <GroupAddIcon fontSize="medium" sx={{ color: "black" }} />,
    },
  ];

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 2,
        }}
      >
        {cards.map((card, index) => (
          <Card key={card.id} sx={{ width: "100%" }}>
            <CardActionArea
              onClick={() => setSelectedCard(index)}
              data-active={selectedCard === index ? "" : undefined}
              sx={{
                height: "100%",
                "&[data-active]": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.selectedHover",
                  },
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  {card.icon}
                </Box>
                <Typography variant="h5">{card.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default SelectActionCard;
